require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/api/auth',       require('./src/routes/authRoutes'));
app.use('/api/productos',  require('./src/routes/productoRoutes'));
app.use('/api/categorias', require('./src/routes/categoriaRoutes'));
app.use('/api/ventas',     require('./src/routes/ventaRoutes'));
app.use('/api/compras',    require('./src/routes/compraRoutes'));
app.use('/api/clientes',   require('./src/routes/clienteRoutes'));
app.use('/api/proveedores',require('./src/routes/proveedorRoutes'));
app.use('/api/reportes',   require('./src/routes/reporteRoutes'));

// Ruta raíz → sirve el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Súper Mercadito corriendo en http://localhost:${PORT}`);
});
