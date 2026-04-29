const express = require('express');
const router = express.Router();
const categoriaCtrl = require('../controllers/categoriaController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/', verificarToken, categoriaCtrl.getAll);
router.get('/:id', verificarToken, categoriaCtrl.getById);
router.post('/', verificarToken, soloAdmin, categoriaCtrl.crear);
router.put('/:id', verificarToken, soloAdmin, categoriaCtrl.actualizar);
router.delete('/:id', verificarToken, soloAdmin, categoriaCtrl.eliminar);

module.exports = router;
