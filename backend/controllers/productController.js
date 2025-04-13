const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { autenticarToken, autorizarRol } = require("../middlewares/auth");

router.get("/", autenticarToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

router.post("/", autenticarToken, autorizarRol("admin", "register"), async (req, res) => {
  const { code, name, description, quantity, price } = req.body;
  try {
    const query = `
      INSERT INTO products (code, name, description, quantity, price)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [code, name, description, quantity, price];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear producto:", err);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:id", autenticarToken, autorizarRol("admin", "register"), async (req, res) => {
  const { id } = req.params;
  const { code, name, description, quantity, price } = req.body;
  try {
    const result = await pool.query(`
      UPDATE products 
      SET code = $1, name = $2, description = $3, quantity = $4, price = $5
      WHERE id = $6 RETURNING *`, [code, name, description, quantity, price, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:id", autenticarToken, autorizarRol("admin", "register"), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;
