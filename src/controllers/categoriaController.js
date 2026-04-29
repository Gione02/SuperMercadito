const categoriaRepo = require('../repositories/categoriaRepository');

const getAll = async (req, res) => {
  try {
    const categorias = await categoriaRepo.getAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const categoria = await categoriaRepo.getById(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    if (!nombre_categoria || !nombre_categoria.trim()) {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }
    const nueva = await categoriaRepo.crear({ nombre_categoria: nombre_categoria.trim() });
    res.status(201).json(nueva);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const { nombre_categoria } = req.body;
    if (!nombre_categoria || !nombre_categoria.trim()) {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }
    await categoriaRepo.actualizar(req.params.id, { nombre_categoria: nombre_categoria.trim() });
    res.json({ mensaje: 'Categoría actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    await categoriaRepo.eliminar(req.params.id);
    res.json({ mensaje: 'Categoría eliminada correctamente' });
  } catch (err) {
    if (err.code === 'CATEGORY_IN_USE') {
      return res.status(409).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAll, getById, crear, actualizar, eliminar };
