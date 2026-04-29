const express = require('express');
const router  = express.Router();
const ventaCtrl = require('../controllers/ventaController');
const { verificarToken, soloAdmin } = require('../middlewares/authMiddleware');

// POST /api/ventas/nueva            → iniciar nueva venta
router.post('/nueva',             verificarToken, ventaCtrl.nueva);
// POST /api/ventas/agregar-producto → agregar producto al detalle
router.post('/agregar-producto',  verificarToken, ventaCtrl.agregarProducto);
// POST /api/ventas/finalizar        → finalizar venta y actualizar stock
router.post('/finalizar',         verificarToken, ventaCtrl.finalizar);
// GET  /api/ventas/reporte?inicio=&fin=
router.get('/reporte',            verificarToken, soloAdmin, ventaCtrl.getByPeriodo);
// GET  /api/ventas/:id
router.get('/:id',                verificarToken, ventaCtrl.getById);
// PUT  /api/ventas/:id/anular
router.put('/:id/anular',         verificarToken, soloAdmin, ventaCtrl.anular);

module.exports = router;
