const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const authRepo = require('../repositories/authRepository');

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password)
      return res.status(400).json({ error: 'Correo y contraseña son requeridos' });

    const usuario = await authRepo.findByCorreo(correo);
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      usuario: { id: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registro = async (req, res) => {
  try {
    const { nombre, correo, password, rol } = req.body;
    if (!nombre || !correo || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos' });
    }
    const hash = await bcrypt.hash(password, 10);
    const nuevo = await authRepo.crear({ nombre, correo, password: hash, rol: rol || 'Cajero' });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await authRepo.getAll();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizarUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { nombre, correo, rol } = req.body;
    if (!nombre || !correo || !rol) {
      return res.status(400).json({ error: 'Nombre, correo y rol son requeridos' });
    }
    const actualizado = await authRepo.actualizar(id, { nombre, correo, rol });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { estado } = req.body;
    if (typeof estado !== 'boolean') {
      return res.status(400).json({ error: 'El estado debe ser booleano' });
    }
    if (req.usuario.id_usuario === id && estado === false) {
      return res.status(400).json({ error: 'No puedes desactivar tu propio usuario' });
    }
    const actualizado = await authRepo.setEstado(id, estado);
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, registro, listarUsuarios, actualizarUsuario, cambiarEstadoUsuario };
