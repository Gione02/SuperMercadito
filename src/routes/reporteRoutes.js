const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const { poolPromise } = require('../config/db');

// GET /api/reportes/ventas-diarias
router.get('/ventas-diarias', verificarToken, soloAdmin, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query(`
    SELECT CAST(fecha AS DATE) AS dia,
           COUNT(*) AS total_ventas,
           SUM(total_venta) AS monto_total
    FROM Ventas
    WHERE estado = 'Completada'
    GROUP BY CAST(fecha AS DATE)
    ORDER BY dia DESC
  `);
  res.json(r.recordset);
});

// GET /api/reportes/productos-mas-vendidos
router.get('/productos-mas-vendidos', verificarToken, soloAdmin, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query(`
    SELECT TOP 10 p.nombre,
           SUM(dv.cantidad) AS unidades_vendidas,
           SUM(dv.subtotal) AS ingresos_totales
    FROM Detalle_Venta dv
    INNER JOIN Productos p ON dv.id_producto = p.id_producto
    INNER JOIN Ventas v ON dv.id_venta = v.id_venta
    WHERE v.estado = 'Completada'
    GROUP BY p.id_producto, p.nombre
    ORDER BY unidades_vendidas DESC
  `);
  res.json(r.recordset);
});

// GET /api/reportes/stock-bajo
router.get('/stock-bajo', verificarToken, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query(`
    SELECT p.nombre, p.stock_actual, p.stock_minimo,
           c.nombre_categoria,
           (p.stock_minimo - p.stock_actual) AS unidades_faltantes
    FROM Productos p
    INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
    WHERE p.stock_actual <= p.stock_minimo AND p.estado = 1
    ORDER BY unidades_faltantes DESC
  `);
  res.json(r.recordset);
});

// GET /api/reportes/compras-proveedor
router.get('/compras-proveedor', verificarToken, soloAdmin, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query(`
    SELECT p.nombre AS proveedor,
           COUNT(c.id_compra) AS total_compras,
           SUM(c.total_compra) AS monto_total
    FROM Compras c
    INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    GROUP BY p.id_proveedor, p.nombre
    ORDER BY monto_total DESC
  `);
  res.json(r.recordset);
});

module.exports = router;
