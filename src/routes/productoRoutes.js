const express = require('express');
const router  = express.Router();
const productoCtrl = require('../controllers/productoController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// GET /api/productos         → todos los productos
router.get('/',           verificarToken, productoCtrl.getAll);
// GET /api/productos/buscar?q=  → buscar por nombre o código
router.get('/buscar',     verificarToken, productoCtrl.buscar);
// GET /api/productos/stock-bajo → productos con stock mínimo
router.get('/stock-bajo', verificarToken, productoCtrl.stockBajo);
// GET /api/productos/:id
router.get('/:id',        verificarToken, productoCtrl.getById);
// POST /api/productos        → crear (solo admin)
router.post('/',          verificarToken, soloAdmin, productoCtrl.crear);
// PUT /api/productos/:id     → actualizar (solo admin)
router.put('/:id',        verificarToken, soloAdmin, productoCtrl.actualizar);
// DELETE /api/productos/:id  → eliminar lógico (solo admin)
router.delete('/:id',     verificarToken, soloAdmin, productoCtrl.eliminar);

module.exports = router;
