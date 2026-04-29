const { sql, poolPromise } = require('../config/db');

const getAll = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT c.*,
      (SELECT COUNT(1) FROM Productos p WHERE p.id_categoria = c.id_categoria AND p.estado = 1) AS total_productos
    FROM Categorias c
    WHERE c.estado = 1
    ORDER BY c.nombre_categoria
  `);
  return result.recordset;
};

const getById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query('SELECT * FROM Categorias WHERE id_categoria = @id AND estado = 1');
  return result.recordset[0];
};

const crear = async (categoria) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('nombre_categoria', sql.NVarChar(100), categoria.nombre_categoria)
    .query(`
      INSERT INTO Categorias (nombre_categoria)
      OUTPUT INSERTED.*
      VALUES (@nombre_categoria)
    `);
  return result.recordset[0];
};

const actualizar = async (id, categoria) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('id', sql.Int, id)
    .input('nombre_categoria', sql.NVarChar(100), categoria.nombre_categoria)
    .query(`
      UPDATE Categorias
      SET nombre_categoria = @nombre_categoria
      WHERE id_categoria = @id AND estado = 1
    `);
};

const eliminar = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`
      SELECT COUNT(1) AS total
      FROM Productos
      WHERE id_categoria = @id AND estado = 1
    `);

  if (result.recordset[0].total > 0) {
    const err = new Error('No se puede eliminar la categoría porque tiene productos activos');
    err.code = 'CATEGORY_IN_USE';
    throw err;
  }

  await pool
    .request()
    .input('id', sql.Int, id)
    .query('UPDATE Categorias SET estado = 0 WHERE id_categoria = @id');
};

module.exports = { getAll, getById, crear, actualizar, eliminar };
