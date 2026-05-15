const express = require('express');
const router  = express.Router();
const ventaCtrl = require('../controllers/ventaController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// GET  /api/ventas/estadisticas/por-dia  ← DEBE IR ANTES de /:id
router.get('/estadisticas/por-dia', verificarToken, soloAdmin, ventaCtrl.getVentasPorDia);

// POST /api/ventas/nueva
router.post('/nueva',             verificarToken, ventaCtrl.nueva);
// POST /api/ventas/agregar-producto
router.post('/agregar-producto',  verificarToken, ventaCtrl.agregarProducto);
// POST /api/ventas/finalizar
router.post('/finalizar',         verificarToken, ventaCtrl.finalizar);
// GET  /api/ventas/reporte?inicio=&fin=
router.get('/reporte',            verificarToken, soloAdmin, ventaCtrl.getByPeriodo);
// GET  /api/ventas/:id
router.get('/:id',                verificarToken, ventaCtrl.getById);
// PUT  /api/ventas/:id/anular
router.put('/:id/anular',         verificarToken, soloAdmin, ventaCtrl.anular);

module.exports = router;