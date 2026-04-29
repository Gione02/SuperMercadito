const { sql, poolPromise } = require('../config/db');

const findByCorreo = async (correo) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('correo', sql.NVarChar(100), correo)
    .query('SELECT * FROM Usuarios WHERE correo = @correo AND estado = 1');
  return result.recordset[0];
};

const crear = async (usuario) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('nombre',   sql.NVarChar(100), usuario.nombre)
    .input('correo',   sql.NVarChar(100), usuario.correo)
    .input('password', sql.NVarChar(255), usuario.password) // ya cifrado
    .input('rol',      sql.NVarChar(50),  usuario.rol)
    .query(`
      INSERT INTO Usuarios (nombre, correo, password, rol)
      OUTPUT INSERTED.id_usuario, INSERTED.nombre, INSERTED.correo, INSERTED.rol
      VALUES (@nombre, @correo, @password, @rol)
    `);
  return result.recordset[0];
};

const getAll = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT id_usuario, nombre, correo, rol, fecha_creacion, estado
    FROM Usuarios
    ORDER BY fecha_creacion DESC
  `);
  return result.recordset;
};

const actualizar = async (id, usuario) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_usuario', sql.Int, id)
    .input('nombre', sql.NVarChar(100), usuario.nombre)
    .input('correo', sql.NVarChar(100), usuario.correo)
    .input('rol', sql.NVarChar(50), usuario.rol)
    .query(`
      UPDATE Usuarios
      SET nombre = @nombre, correo = @correo, rol = @rol
      WHERE id_usuario = @id_usuario;

      SELECT id_usuario, nombre, correo, rol, fecha_creacion, estado
      FROM Usuarios
      WHERE id_usuario = @id_usuario
    `);
  return result.recordset[0];
};

const setEstado = async (id, estado) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('id_usuario', sql.Int, id)
    .input('estado', sql.Bit, estado)
    .query(`
      UPDATE Usuarios
      SET estado = @estado
      WHERE id_usuario = @id_usuario;

      SELECT id_usuario, nombre, correo, rol, fecha_creacion, estado
      FROM Usuarios
      WHERE id_usuario = @id_usuario
    `);
  return result.recordset[0];
};

module.exports = { findByCorreo, crear, getAll, actualizar, setEstado };
