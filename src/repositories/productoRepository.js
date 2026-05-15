const { sql, poolPromise } = require('../config/db');

const getAll = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT p.*, c.nombre_categoria
    FROM Productos p
    INNER JOIN Categorias c ON p.id_categoria = c.id_categoria
    WHERE p.estado = 1
    ORDER BY p.nombre
  `);
  return result.recordset;
};

const getById = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Productos WHERE id_producto = @id AND estado = 1');
  return result.recordset[0];
};

const buscar = async (query) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('q', sql.NVarChar, `%${query}%`)
    .query(`
      SELECT * FROM Productos
      WHERE (nombre LIKE @q OR codigo_barra LIKE @q)
      AND estado = 1
    `);
  return result.recordset;
};

const crear = async (producto) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('nombre',        sql.NVarChar(150), producto.nombre)
    .input('descripcion',   sql.NVarChar(255), producto.descripcion || '')
    .input('precio_compra', sql.Decimal(10,2), producto.precio_compra)
    .input('precio_venta',  sql.Decimal(10,2), producto.precio_venta)
    .input('stock_actual',  sql.Int,           producto.stock_actual)
    .input('stock_minimo',  sql.Int,           producto.stock_minimo)
    .input('codigo_barra',  sql.NVarChar(50),  producto.codigo_barra || '')
    .input('id_categoria',  sql.Int,           producto.id_categoria)
    .query(`
      INSERT INTO Productos
        (nombre, descripcion, precio_compra, precio_venta, stock_actual, stock_minimo, codigo_barra, id_categoria)
      OUTPUT INSERTED.*
      VALUES
        (@nombre, @descripcion, @precio_compra, @precio_venta, @stock_actual, @stock_minimo, @codigo_barra, @id_categoria)
    `);
  return result.recordset[0];
};

const actualizar = async (id, producto) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id',            sql.Int,           id)
    .input('nombre',        sql.NVarChar(150), producto.nombre)
    .input('descripcion',   sql.NVarChar(255), producto.descripcion || '')
    .input('precio_compra', sql.Decimal(10,2), producto.precio_compra)
    .input('precio_venta',  sql.Decimal(10,2), producto.precio_venta)
    .input('stock_actual',  sql.Int,           producto.stock_actual)  // ← FIX: ahora sí se actualiza
    .input('stock_minimo',  sql.Int,           producto.stock_minimo)
    .input('codigo_barra',  sql.NVarChar(50),  producto.codigo_barra || '')
    .input('id_categoria',  sql.Int,           producto.id_categoria)
    .query(`
      UPDATE Productos SET
        nombre        = @nombre,
        descripcion   = @descripcion,
        precio_compra = @precio_compra,
        precio_venta  = @precio_venta,
        stock_actual  = @stock_actual,
        stock_minimo  = @stock_minimo,
        codigo_barra  = @codigo_barra,
        id_categoria  = @id_categoria
      WHERE id_producto = @id
    `);
};

const eliminar = async (id) => {
  const pool = await poolPromise;
  await pool.request()
    .input('id', sql.Int, id)
    .query('UPDATE Productos SET estado = 0 WHERE id_producto = @id');
};

const actualizarStock = async (id, cantidad, tipo) => {
  const pool = await poolPromise;
  const op = tipo === 'venta' ? '-' : '+';
  await pool.request()
    .input('id',   sql.Int, id)
    .input('cant', sql.Int, cantidad)
    .query(`
      UPDATE Productos
      SET stock_actual = stock_actual ${op} @cant
      WHERE id_producto = @id
    `);
};


const getStockBajo = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT * FROM Productos
    WHERE stock_actual <= stock_minimo AND estado = 1
    ORDER BY stock_actual ASC
  `);
  return result.recordset;
};

module.exports = { getAll, getById, buscar, crear, actualizar, eliminar, actualizarStock, getStockBajo };