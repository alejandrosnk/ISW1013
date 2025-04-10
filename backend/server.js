const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");
const path = require("path");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

app.use(cors({
  origin: process.env.DOMAIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware para validar el token (actualmente no se usa en productos)
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json("Demasiados intentos de inicio de sesión. Intenta nuevamente en 2 minutos.");
  }
});

// ============================
// 🛍 RUTAS DE PRODUCTOS (CRUD)
// ============================

// Obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener productos:", err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Crear un producto
app.post("/products", async (req, res) => {
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

// Actualizar un producto
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, description, quantity, price } = req.body;
  try {
    const query = `
      UPDATE products 
      SET code = $1, name = $2, description = $3, quantity = $4, price = $5
      WHERE id = $6 RETURNING *`;
    const values = [code, name, description, quantity, price, id];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar producto:", err);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar un producto
app.delete("/products/:id", async (req, res) => {
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

// ============================
// 🔐 RUTAS DE USUARIO (JWT)
// ============================

app.get("/welcome", autenticarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

app.get("/verify", autenticarToken, (req, res) => {
  res.status(200).json({ mensaje: "Token válido", username: req.user.username });
});

app.post("/login", loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (rows.length === 0) {
      return res.status(401).json("Nombre de usuario o contraseña incorrectos.");
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json("Nombre de usuario o contraseña incorrectos.");
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Obtener todos los usuarios (sin contraseñas)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, role, last_login FROM users ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Crear usuario
app.post("/users", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role";
    const values = [username, hashedPassword, role || 'user'];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error al crear usuario" });
  }
});




// Editar usuario (opcional: cambiar contraseña y rol)
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { password, role } = req.body;
  try {
    let query, values;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = "UPDATE users SET password = $1, role = $2 WHERE id = $3 RETURNING id, username, role";
      values = [hashedPassword, role, id];
    } else {
      query = "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, role";
      values = [role, id];
    }

    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al editar usuario:", err);
    res.status(500).json({ error: "Error al editar usuario" });
  }
});

// Eliminar usuario
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

// ============================

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
