const express = require('express');
const router  = express.Router();
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');
const { sql, poolPromise } = require('../config/db');

router.get('/', verificarToken, async (req, res) => {
  const pool = await poolPromise;
  const r = await pool.request().query('SELECT * FROM Proveedores ORDER BY nombre');
  res.json(r.recordset);
});

router.post('/', verificarToken, soloAdmin, async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    const pool = await poolPromise;
    const r = await pool.request()
      .input('nombre',   sql.NVarChar(100), nombre)
      .input('telefono', sql.NVarChar(20),  telefono || '')
      .input('correo',   sql.NVarChar(100), correo || '')
      .query(`
        INSERT INTO Proveedores (nombre, telefono, correo)
        OUTPUT INSERTED.*
        VALUES (@nombre, @telefono, @correo)
      `);
    res.status(201).json(r.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const { nombre, telefono, correo } = req.body;
    const pool = await poolPromise;
    await pool.request()
      .input('id',       sql.Int,           req.params.id)
      .input('nombre',   sql.NVarChar(100), nombre)
      .input('telefono', sql.NVarChar(20),  telefono || '')
      .input('correo',   sql.NVarChar(100), correo || '')
      .query('UPDATE Proveedores SET nombre=@nombre, telefono=@telefono, correo=@correo WHERE id_proveedor=@id');
    res.json({ mensaje: 'Proveedor actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verificarToken, soloAdmin, async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM Proveedores WHERE id_proveedor = @id');
    res.json({ mensaje: 'Proveedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
