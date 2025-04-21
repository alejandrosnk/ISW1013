const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { autenticarToken, autorizarRol } = require("../middlewares/auth");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (rows.length === 0) return res.status(401).json("Nombre de usuario o contraseña incorrectos.");

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json("Nombre de usuario o contraseña incorrectos.");

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Verifica token
router.get("/verify", autenticarToken, (req, res) => {
  res.status(200).json({ mensaje: "Token válido", username: req.user.username });
});

// Página protegida
router.get("/welcome", autenticarToken, (req, res) => {
  res.sendFile(require("path").join(__dirname, "../public", "welcome.html"));
});

// Obtener usuarios
router.get("/", autenticarToken, autorizarRol("admin", "auditor", "register"), async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, role, last_login FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear usuario
router.post("/", autenticarToken, autorizarRol("admin"), async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, hashedPassword, role || "user"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});

// Editar usuario (incluye username)
router.put("/:id", autenticarToken, autorizarRol("admin"), async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;

  try {
    let query, values;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING id, username, role";
      values = [username, hashedPassword, role, id];
    } else {
      query = "UPDATE users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role";
      values = [username, role, id];
    }

    const result = await pool.query(query, values);
    if (result.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar usuario:", err);
    res.status(500).json({ error: "Error al editar usuario" });
  }
});

// Eliminar usuario
router.delete("/:id", autenticarToken, autorizarRol("admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

module.exports = router;
