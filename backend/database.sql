CREATE DATABASE IF NOT EXISTS uthub_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE uthub_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  matricula VARCHAR(10) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  carrera VARCHAR(100),
  rol ENUM('estudiante','emprendedor') DEFAULT 'estudiante',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tiendas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tienda_id INT NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_productos_tienda
    FOREIGN KEY (tienda_id) REFERENCES tiendas(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  estado ENUM('pendiente','preparando','enviado','entregado','cancelado') DEFAULT 'pendiente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detalle_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_detalle_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE CASCADE
);

INSERT INTO tiendas (id, nombre, descripcion, imagen)
SELECT 1, 'Cafetería UThub', 'Comida rápida y bebidas para estudiantes.', NULL
WHERE NOT EXISTS (SELECT 1 FROM tiendas WHERE id = 1);

INSERT INTO productos (id, tienda_id, nombre, precio, descripcion, imagen)
SELECT 1, 1, 'Torta de jamón', 35.00, 'Torta clásica para llevar.', NULL
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 1);

INSERT INTO productos (id, tienda_id, nombre, precio, descripcion, imagen)
SELECT 2, 1, 'Agua natural', 12.00, 'Botella de agua fría.', NULL
WHERE NOT EXISTS (SELECT 1 FROM productos WHERE id = 2);
