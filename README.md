# 🛒 Súper Mercadito
## Sistema de Gestión de Inventario y Ventas
### Proyecto Final - Análisis de Sistemas I
**Universidad Mariano Gálvez de Guatemala - Chimaltenango - 2026**

---

## 👥 Integrantes
| Nombre | Carné |
|--------|-------|
| Bryan Sec Cubur | 1990-23-18630 |
| Alan José Cortez Mayca | 1990-23-17036 |
| Herberth Josue Chocoj Colón | 1990-21-15896 |
| Carlos Enrique Aguilar Sirín | 1990-18-13889 |

---

## 🛠️ Stack Tecnológico
- **Backend:** Node.js + Express.js (patrón MVC + Repository)
- **Base de datos:** Microsoft SQL Server 2019
- **Frontend:** HTML5 + Bootstrap 5 + JavaScript (Fetch API)
- **Autenticación:** JWT (jsonwebtoken) + bcryptjs
- **PDF:** PDFKit

---

## 📁 Estructura del proyecto
```
supermercadito/
├── app.js                    ← Punto de entrada
├── package.json
├── .env.example              ← Copiar como .env
├── database/
│   └── SuperMercaditoDB.sql  ← Script completo BD con seeds
├── public/
│   └── index.html            ← Frontend completo (SPA)
└── src/
    ├── config/
    │   └── db.js             ← Conexión SQL Server
    ├── middlewares/
    │   └── authMiddleware.js ← JWT + roles
    ├── repositories/         ← Acceso a datos
    │   ├── authRepository.js
    │   ├── productoRepository.js
    │   └── ventaRepository.js
    ├── controllers/          ← Lógica de negocio
    │   ├── authController.js
    │   ├── productoController.js
    │   └── ventaController.js
    └── routes/               ← Endpoints REST
        ├── authRoutes.js
        ├── productoRoutes.js
        ├── ventaRoutes.js
        ├── compraRoutes.js
        ├── clienteRoutes.js
        ├── proveedorRoutes.js
        └── reporteRoutes.js
```

---

## ⚙️ Instalación paso a paso

### 1. Clonar el repositorio
```bash
git clone https://github.com/grupo4-sistemas/supermercadito.git
cd supermercadito
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Crear la base de datos
- Abrir SQL Server Management Studio
- Conectarse a la instancia local
- Ejecutar `database/SuperMercaditoDB.sql`

### 4. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus datos de SQL Server
```

### 5. Ejecutar la aplicación
```bash
npm run dev     # modo desarrollo (nodemon)
npm start       # modo producción
```

### 6. Abrir en el navegador
```
http://localhost:3000
```

---

## 🔑 Credenciales de prueba
| Usuario | Correo | Contraseña | Rol |
|---------|--------|------------|-----|
| Administrador | admin@mercadito.com | Admin123! | Administrador |
| Carlos Cajero | cajero@mercadito.com | Admin123! | Cajero |

---

## 📡 API REST - Endpoints principales

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/login | Iniciar sesión |
| POST | /api/auth/registro | Crear usuario (solo Admin) |

### Productos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/productos | Listar todos |
| GET | /api/productos/buscar?q= | Buscar por nombre/código |
| GET | /api/productos/stock-bajo | Productos con alerta de stock |
| POST | /api/productos | Crear producto |
| PUT | /api/productos/:id | Actualizar producto |
| DELETE | /api/productos/:id | Eliminar (lógico) |

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/categorias | Listar categorías activas |
| GET | /api/categorias/:id | Obtener categoría |
| POST | /api/categorias | Crear categoría (solo Admin) |
| PUT | /api/categorias/:id | Actualizar categoría (solo Admin) |
| DELETE | /api/categorias/:id | Eliminar lógica (solo Admin) |

### Ventas (POS)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/ventas/nueva | Iniciar nueva venta |
| POST | /api/ventas/agregar-producto | Agregar producto al detalle |
| POST | /api/ventas/finalizar | Finalizar y actualizar stock |
| GET | /api/ventas/reporte?inicio=&fin= | Reporte por período |
| PUT | /api/ventas/:id/anular | Anular venta |

---

## 📊 Módulos implementados (Fase 2)
| Módulo | Avance |
|--------|--------|
| Base de datos SQL Server | ✅ 100% |
| Autenticación JWT | ✅ 90% |
| CRUD Productos | ✅ 85% |
| Inventario con alertas | ✅ 80% |
| POS (Punto de Venta) | ✅ 75% |
| Gestión Proveedores | 🔄 70% |
| Registro de Compras | 🔄 65% |
| Reportes | 🔄 40% |
| Generación PDF facturas | 🔄 30% |
| Integración pagos | ⏳ 20% |

---

## 🎓 Metodología
El proyecto sigue el **Modelo en Cascada** con arquitectura **MVC + Repository Pattern**.

**Catedrático:** Ing. Jorge Ramiro Ibarra Monroy
