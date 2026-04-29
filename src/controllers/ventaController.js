const ventaRepo   = require('../repositories/ventaRepository');
const productoRepo = require('../repositories/productoRepository');

const nueva = async (req, res) => {
  try {
    const { id_cliente } = req.body;
    const venta = await ventaRepo.crear(req.usuario.id_usuario, id_cliente);
    res.status(201).json(venta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const agregarProducto = async (req, res) => {
  try {
    const { id_venta, id_producto, cantidad } = req.body;

    // Verificar stock disponible
    const producto = await productoRepo.getById(id_producto);
    if (!producto)
      return res.status(404).json({ error: 'Producto no encontrado' });
    if (producto.stock_actual < cantidad)
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${producto.stock_actual}` });

    const detalle = await ventaRepo.agregarDetalle(
      id_venta, id_producto, cantidad, producto.precio_venta
    );
    res.status(201).json({ detalle, producto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const finalizar = async (req, res) => {
  try {
    const { id_venta, metodo_pago } = req.body;

    if (!['Efectivo', 'Tarjeta', 'Transferencia'].includes(metodo_pago))
      return res.status(400).json({ error: 'Método de pago inválido' });

    // Obtener detalles para actualizar stock
    const { venta, detalle } = await ventaRepo.getById(id_venta);
    if (venta.estado !== 'En proceso')
      return res.status(400).json({ error: 'La venta ya fue procesada' });

    // Actualizar stock de cada producto
    for (const item of detalle) {
      await productoRepo.actualizarStock(item.id_producto, item.cantidad, 'venta');
    }

    // Finalizar venta
    await ventaRepo.finalizar(id_venta, metodo_pago);

    // Obtener datos completos para la factura
    const ventaFinal = await ventaRepo.getById(id_venta);
    res.json(ventaFinal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const venta = await ventaRepo.getById(req.params.id);
    if (!venta.venta) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(venta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getByPeriodo = async (req, res) => {
  try {
    const { inicio, fin } = req.query;
    const ventas = await ventaRepo.getByPeriodo(new Date(inicio), new Date(fin));
    res.json(ventas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const anular = async (req, res) => {
  try {
    await ventaRepo.anular(req.params.id);
    res.json({ mensaje: 'Venta anulada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { nueva, agregarProducto, finalizar, getById, getByPeriodo, anular };
