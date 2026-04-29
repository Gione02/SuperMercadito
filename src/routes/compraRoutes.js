// compraRoutes.js
const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const { sql, poolPromise } = require('../config/db');

router.get('/', verificarToken, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query(`
    SELECT c.*, p.nombre AS proveedor
    FROM Compras c
    INNER JOIN Proveedores p ON c.id_proveedor = p.id_proveedor
    ORDER BY c.fecha DESC
  `);
  res.json(r.recordset);
});

router.post('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const { id_proveedor, detalle } = req.body;
    // detalle = [{ id_producto, cantidad, precio_compra }]
    const pool = await poolPromise;
    const compra = await pool.request()
      .input('id_proveedor', sql.Int, id_proveedor)
      .query(`
        INSERT INTO Compras (id_proveedor, total_compra, estado)
        OUTPUT INSERTED.*
        VALUES (@id_proveedor, 0, 'Recibida')
      `);
    const id_compra = compra.recordset[0].id_compra;

    let total = 0;
    for (const item of detalle) {
      const subtotal = item.cantidad * item.precio_compra;
      total += subtotal;
      await pool.request()
        .input('id_compra',     sql.Int,          id_compra)
        .input('id_producto',   sql.Int,          item.id_producto)
        .input('cantidad',      sql.Int,          item.cantidad)
        .input('precio_compra', sql.Decimal(10,2), item.precio_compra)
        .input('subtotal',      sql.Decimal(10,2), subtotal)
        .query(`
          INSERT INTO Detalle_Compra (id_compra, id_producto, cantidad, precio_compra, subtotal)
          VALUES (@id_compra, @id_producto, @cantidad, @precio_compra, @subtotal)
        `);
      // Actualizar stock
      await pool.request()
        .input('id',   sql.Int, item.id_producto)
        .input('cant', sql.Int, item.cantidad)
        .query('UPDATE Productos SET stock_actual = stock_actual + @cant WHERE id_producto = @id');
    }
    // Actualizar total compra
    await pool.request()
      .input('id',    sql.Int,          id_compra)
      .input('total', sql.Decimal(10,2), total)
      .query('UPDATE Compras SET total_compra = @total WHERE id_compra = @id');

    res.status(201).json({ id_compra, total, mensaje: 'Compra registrada y stock actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
