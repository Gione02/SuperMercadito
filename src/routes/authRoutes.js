const express = require('express');
const router  = express.Router();
const authCtrl = require('../controllers/authController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// POST /api/auth/login
router.post('/login', authCtrl.login);

// POST /api/auth/registro  (solo admin puede crear usuarios)
router.post('/registro', verificarToken, soloAdmin, authCtrl.registro);
router.get('/usuarios', verificarToken, soloAdmin, authCtrl.listarUsuarios);
router.put('/usuarios/:id', verificarToken, soloAdmin, authCtrl.actualizarUsuario);
router.put('/usuarios/:id/estado', verificarToken, soloAdmin, authCtrl.cambiarEstadoUsuario);

module.exports = router;
