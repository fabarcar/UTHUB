const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

/* ============================================
   🏪 TIENDAS
============================================ */

// Obtener tiendas
router.get('/tiendas', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tiendas');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tiendas' });
  }
});

// Obtener UNA tienda por ID
router.get('/tienda/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM tiendas WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener tienda' });
  }
});

// Crear tienda
router.post('/tienda', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre requerido' });
    }

    const [result] = await db.query(
      'INSERT INTO tiendas (nombre, descripcion, imagen) VALUES (?, ?, ?)',
      [nombre, descripcion, imagen]
    );

    res.json({
      id: result.insertId,
      nombre,
      descripcion,
      imagen
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear tienda' });
  }
});

// Editar tienda
router.put('/tienda/:id', async (req, res) => {
  try {
    const { nombre, descripcion, imagen } = req.body;

    await db.query(
      'UPDATE tiendas SET nombre=?, descripcion=?, imagen=? WHERE id=?',
      [nombre, descripcion, imagen, req.params.id]
    );

    res.json({ ok: true });

  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar tienda' });
  }
});

/* ============================================
   🍔 PRODUCTOS
============================================ */

// Obtener productos por tienda
router.get('/productos/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM productos WHERE tienda_id = ?',
      [req.params.id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Crear producto
router.post('/producto', async (req, res) => {
  try {
    const { nombre, precio, descripcion, imagen, tienda_id } = req.body;

    if (!nombre || !precio || !tienda_id) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const [result] = await db.query(
      'INSERT INTO productos (nombre, precio, descripcion, imagen, tienda_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, precio, descripcion, imagen, tienda_id]
    );

    res.json({
      id: result.insertId,
      nombre,
      precio
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

/* ============================================
   🧾 PEDIDOS
============================================ */

// Crear pedido
router.post('/pedido', auth, async (req, res) => {
  try {
    const { items, ubicacion } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    const userId = req.usuario.id;

    // obtener productos reales de la BD
    const ids = items.map(i => i.id);

    const [productos] = await db.query(
      `SELECT id, precio FROM productos WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    );

    let total = 0;

    items.forEach(item => {
      const prod = productos.find(p => p.id === item.id);
      if (prod) {
        total += prod.precio * item.cantidad;
      }
    });

    // crear pedido
    const [pedido] = await db.query(
      'INSERT INTO pedidos (usuario_id, ubicacion, total) VALUES (?, ?, ?)',
      [userId, ubicacion, total]
    );

    // guardar detalle
    for (const item of items) {
      await db.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad) VALUES (?, ?, ?)',
        [pedido.insertId, item.id, item.cantidad]
      );
    }

    res.json({ ok: true, pedidoId: pedido.insertId });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear pedido' });
  }
});

module.exports = router;
