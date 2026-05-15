const { sql, poolPromise } = require('../config/db');

const crear = async (id_usuario, id_cliente) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_usuario', sql.Int, id_usuario)
    .input('id_cliente', sql.Int, id_cliente || null)
    .query(`
      INSERT INTO Ventas (id_usuario, id_cliente, total_venta, estado)
      OUTPUT INSERTED.*
      VALUES (@id_usuario, @id_cliente, 0, 'En proceso')
    `);
  return result.recordset[0];
};

const agregarDetalle = async (id_venta, id_producto, cantidad, precio_unitario) => {
  const pool = await poolPromise;
  const subtotal = cantidad * precio_unitario;
  const result = await pool.request()
    .input('id_venta',        sql.Int,          id_venta)
    .input('id_producto',     sql.Int,          id_producto)
    .input('cantidad',        sql.Int,          cantidad)
    .input('precio_unitario', sql.Decimal(10,2),precio_unitario)
    .input('subtotal',        sql.Decimal(10,2),subtotal)
    .query(`
      INSERT INTO Detalle_Venta (id_venta, id_producto, cantidad, precio_unitario, subtotal)
      OUTPUT INSERTED.*
      VALUES (@id_venta, @id_producto, @cantidad, @precio_unitario, @subtotal)
    `);
  return result.recordset[0];
};

const finalizar = async (id_venta, metodo_pago) => {
  const pool = await poolPromise;
  // Calcular total desde detalles
  await pool.request()
    .input('id_venta',    sql.Int,          id_venta)
    .input('metodo_pago', sql.NVarChar(50), metodo_pago)
    .query(`
      UPDATE Ventas SET
        total_venta = (SELECT SUM(subtotal) FROM Detalle_Venta WHERE id_venta = @id_venta),
        metodo_pago = @metodo_pago,
        estado = 'Completada'
      WHERE id_venta = @id_venta
    `);
};

const getById = async (id_venta) => {
  const pool = await poolPromise;
  const ventaResult = await pool.request()
    .input('id', sql.Int, id_venta)
    .query(`
      SELECT v.*, u.nombre AS cajero, c.nombre AS cliente
      FROM Ventas v
      LEFT JOIN Usuarios u ON v.id_usuario = u.id_usuario
      LEFT JOIN Clientes c ON v.id_cliente = c.id_cliente
      WHERE v.id_venta = @id
    `);
  const detalleResult = await pool.request()
    .input('id', sql.Int, id_venta)
    .query(`
      SELECT dv.*, p.nombre AS producto
      FROM Detalle_Venta dv
      INNER JOIN Productos p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = @id
    `);
  return {
    venta: ventaResult.recordset[0],
    detalle: detalleResult.recordset
  };
};

const getByPeriodo = async (fechaInicio, fechaFin) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('inicio', sql.DateTime, fechaInicio)
    .input('fin',    sql.DateTime, fechaFin)
    .query(`
      SELECT v.*, u.nombre AS cajero, c.nombre AS cliente
      FROM Ventas v
      LEFT JOIN Usuarios u ON v.id_usuario = u.id_usuario
      LEFT JOIN Clientes c ON v.id_cliente = c.id_cliente
      WHERE v.fecha BETWEEN @inicio AND @fin
      AND v.estado = 'Completada'
      ORDER BY v.fecha DESC
    `);
  return result.recordset;
};

const anular = async (id_venta) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id_venta)
    .query("UPDATE Ventas SET estado = 'Anulada' WHERE id_venta = @id");
};

const getVentasPorDia = async (dias = 7) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('dias', sql.Int, dias)
    .query(`
      SELECT 
        CAST(fecha AS DATE) AS fecha,
        COUNT(*) AS total_ventas,
        ISNULL(SUM(total_venta), 0) AS total_ingresos
      FROM Ventas
      WHERE estado = 'Completada'
        AND fecha >= DATEADD(DAY, -@dias, GETDATE())
      GROUP BY CAST(fecha AS DATE)
      ORDER BY CAST(fecha AS DATE) ASC
    `);
  return result.recordset;
};
module.exports = { crear, agregarDetalle, finalizar, getById, getByPeriodo, anular, getVentasPorDia };
