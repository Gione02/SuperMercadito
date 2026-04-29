const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const { sql, poolPromise } = require('../config/db');

router.get('/', verificarToken, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query('SELECT * FROM Clientes ORDER BY nombre');
  res.json(r.recordset);
});

router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    const pool = await poolPromise;
    const r = await pool.request()
      .input('nombre',   sql.NVarChar(100), nombre)
      .input('telefono', sql.NVarChar(20),  telefono || '')
      .input('correo',   sql.NVarChar(100), correo || '')
      .query(`
        INSERT INTO Clientes (nombre, telefono, correo)
        OUTPUT INSERTED.*
        VALUES (@nombre, @telefono, @correo)
      `);
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .input('nombre', sql.NVarChar(100), nombre)
      .input('telefono', sql.NVarChar(20), telefono || '')
      .input('correo', sql.NVarChar(100), correo || '')
      .query(`
        UPDATE Clientes
        SET nombre = @nombre, telefono = @telefono, correo = @correo
        WHERE id_cliente = @id
      `);
    res.json({ mensaje: 'Cliente actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Clientes WHERE id_cliente = @id');
    res.json({ mensaje: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
