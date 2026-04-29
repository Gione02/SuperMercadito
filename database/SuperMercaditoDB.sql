-- ============================================================
-- SuperMercaditoDB - Script de creación de base de datos
-- Proyecto Final Análisis de Sistemas I
-- Universidad Mariano Gálvez - 2026
-- ============================================================

CREATE DATABASE SuperMercaditoDB;
GO

USE SuperMercaditoDB;
GO

-- ============================================================
-- TABLAS BASE (sin FK)
-- ============================================================

CREATE TABLE Categorias (
    id_categoria    INT IDENTITY(1,1) PRIMARY KEY,
    nombre_categoria NVARCHAR(100) NOT NULL,
    estado          BIT DEFAULT 1
);

CREATE TABLE Usuarios (
    id_usuario      INT IDENTITY(1,1) PRIMARY KEY,
    nombre          NVARCHAR(100) NOT NULL,
    correo          NVARCHAR(100) NOT NULL UNIQUE,
    password        NVARCHAR(255) NOT NULL,
    rol             NVARCHAR(50)  NOT NULL CHECK (rol IN ('Administrador','Cajero')),
    fecha_creacion  DATETIME DEFAULT GETDATE(),
    estado          BIT DEFAULT 1
);

CREATE TABLE Clientes (
    id_cliente      INT IDENTITY(1,1) PRIMARY KEY,
    nombre          NVARCHAR(100) NOT NULL,
    telefono        NVARCHAR(20),
    correo          NVARCHAR(100),
    fecha_registro  DATETIME DEFAULT GETDATE()
);

CREATE TABLE Proveedores (
    id_proveedor    INT IDENTITY(1,1) PRIMARY KEY,
    nombre          NVARCHAR(100) NOT NULL,
    telefono        NVARCHAR(20),
    correo          NVARCHAR(100)
);

-- ============================================================
-- TABLAS CON FK
-- ============================================================

CREATE TABLE Productos (
    id_producto     INT IDENTITY(1,1) PRIMARY KEY,
    nombre          NVARCHAR(150) NOT NULL,
    descripcion     NVARCHAR(255),
    precio_compra   DECIMAL(10,2) NOT NULL,
    precio_venta    DECIMAL(10,2) NOT NULL,
    stock_actual    INT DEFAULT 0,
    stock_minimo    INT DEFAULT 5,
    codigo_barra    NVARCHAR(50),
    id_categoria    INT NOT NULL,
    estado          BIT DEFAULT 1,
    CONSTRAINT FK_Prod_Cat FOREIGN KEY (id_categoria)
        REFERENCES Categorias(id_categoria)
);

CREATE TABLE Ventas (
    id_venta        INT IDENTITY(1,1) PRIMARY KEY,
    fecha           DATETIME DEFAULT GETDATE(),
    id_usuario      INT NOT NULL,
    id_cliente      INT,
    total_venta     DECIMAL(10,2) DEFAULT 0,
    metodo_pago     NVARCHAR(50)  CHECK (metodo_pago IN ('Efectivo','Tarjeta','Transferencia')),
    estado          NVARCHAR(20)  DEFAULT 'En proceso',
    CONSTRAINT FK_Ven_Usr FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario),
    CONSTRAINT FK_Ven_Cli FOREIGN KEY (id_cliente)
        REFERENCES Clientes(id_cliente)
);

CREATE TABLE Detalle_Venta (
    id_detalle      INT IDENTITY(1,1) PRIMARY KEY,
    id_venta        INT NOT NULL,
    id_producto     INT NOT NULL,
    cantidad        INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_DV_Ven  FOREIGN KEY (id_venta)
        REFERENCES Ventas(id_venta),
    CONSTRAINT FK_DV_Prod FOREIGN KEY (id_producto)
        REFERENCES Productos(id_producto)
);

CREATE TABLE Compras (
    id_compra       INT IDENTITY(1,1) PRIMARY KEY,
    fecha           DATETIME DEFAULT GETDATE(),
    id_proveedor    INT NOT NULL,
    total_compra    DECIMAL(10,2) DEFAULT 0,
    estado          NVARCHAR(20)  DEFAULT 'Recibida',
    CONSTRAINT FK_Comp_Prov FOREIGN KEY (id_proveedor)
        REFERENCES Proveedores(id_proveedor)
);

CREATE TABLE Detalle_Compra (
    id_detalle_compra INT IDENTITY(1,1) PRIMARY KEY,
    id_compra       INT NOT NULL,
    id_producto     INT NOT NULL,
    cantidad        INT NOT NULL,
    precio_compra   DECIMAL(10,2) NOT NULL,
    subtotal        DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_DC_Comp FOREIGN KEY (id_compra)
        REFERENCES Compras(id_compra),
    CONSTRAINT FK_DC_Prod FOREIGN KEY (id_producto)
        REFERENCES Productos(id_producto)
);

GO

-- ============================================================
-- DATOS DE PRUEBA (seeds)
-- ============================================================

INSERT INTO Categorias (nombre_categoria) VALUES
('Lácteos'), ('Carnes'), ('Verduras'), ('Bebidas'),
('Limpieza'), ('Panadería'), ('Snacks'), ('Congelados');

-- Contraseña: Admin123! (hash bcrypt)
INSERT INTO Usuarios (nombre, correo, password, rol) VALUES
('Administrador', 'admin@mercadito.com',
 '$2a$10$tQ1hGGiCvSigPPCuXtEgxutBsexSTLbXr54pf8WqAGYlqGav7xaYi', 'Administrador'),
('Carlos Cajero', 'cajero@mercadito.com',
 '$2a$10$tQ1hGGiCvSigPPCuXtEgxutBsexSTLbXr54pf8WqAGYlqGav7xaYi', 'Cajero');

INSERT INTO Clientes (nombre, telefono, correo) VALUES
('Consumidor Final', '', ''),
('María García',     '5555-1234', 'maria@gmail.com'),
('Juan Pérez',       '5555-5678', 'juan@gmail.com');

INSERT INTO Proveedores (nombre, telefono, correo) VALUES
('Distribuidora La Familiar',  '2222-1111', 'lafamiliar@gmail.com'),
('Productos del Campo S.A.',   '2222-2222', 'delcampo@gmail.com'),
('Bebidas Nacionales',         '2222-3333', 'bebidas@gmail.com');

INSERT INTO Productos (nombre, precio_compra, precio_venta, stock_actual, stock_minimo, codigo_barra, id_categoria) VALUES
('Leche Entera 1L',        8.50,  12.00, 50, 10, '7501000001', 1),
('Queso Blanco 500g',      18.00, 25.00, 30,  5, '7501000002', 1),
('Pollo Entero 1Kg',       28.00, 38.00, 20,  5, '7501000003', 2),
('Tomate 1Lb',              4.00,  7.00, 40, 10, '7501000004', 3),
('Agua Pura 500ml',         2.50,  4.00, 80, 20, '7501000005', 4),
('Coca-Cola 355ml',         5.00,  8.00, 60, 15, '7501000006', 4),
('Detergente Líquido 1L',  15.00, 22.00, 25,  5, '7501000007', 5),
('Pan Francés x6',          4.00,  7.00, 35, 10, '7501000008', 6),
('Papas Fritas Pequeñas',   4.50,  7.00, 45, 10, '7501000009', 7),
('Helado Vainilla 1L',     20.00, 30.00,  3,  5, '7501000010', 8);  -- stock bajo intencional

GO
