const productoRepo = require('../repositories/productoRepository');

const getAll = async (req, res) => {
  try {
    const productos = await productoRepo.getAll();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const producto = await productoRepo.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const buscar = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Parámetro de búsqueda requerido' });
    const productos = await productoRepo.buscar(q);
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const nuevo = await productoRepo.crear(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    await productoRepo.actualizar(req.params.id, req.body);
    res.json({ mensaje: 'Producto actualizado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    await productoRepo.eliminar(req.params.id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const stockBajo = async (req, res) => {
  try {
    const productos = await productoRepo.getStockBajo();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, buscar, crear, actualizar, eliminar, stockBajo };
