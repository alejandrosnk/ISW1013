const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("./db");
const path = require("path");
const rateLimit = require("express-rate-limit"); // 👈 Importar express-rate-limit
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

// Habilitar CORS
app.use(cors({
  origin: process.env.DOMAIN,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Middleware para autenticar token
function autenticarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// 💡 Limitador de intentos para /login con mensaje personalizado
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutos
  max: 3, // Máximo de 3 intentos
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    res.status(429).json("Demasiados intentos de inicio de sesión. Intenta nuevamente en 2 minutos.");
  }
});

// Ruta protegida
app.get("/welcome", autenticarToken, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

// Verificar token
app.get("/verify", autenticarToken, (req, res) => {
  res.status(200).json({ mensaje: "Token válido", correo: req.user.correo });
});

// Registro de usuario
app.post("/registro", async (req, res) => {
  const { correo, contrasenna_hash } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(contrasenna_hash, 10);
    const query = "INSERT INTO usuarios (correo, contrasenna_hash) VALUES ($1, $2)";
    await pool.query(query, [correo, hashedPassword]);
    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
});


// Login sin correcciones aplicadas
/*
app.post("/login", loginLimiter, async (req, res) => {
  const { correo, contrasenna_hash } = req.body;
  try {
    const query = `SELECT * FROM usuarios WHERE correo = '${correo}'`; // el correo se concatena directamente en la consulta
    const { rows } = await pool.query(query);

    if (rows.length === 0) return res.status(401).json("Correo o contraseña incorrectos");

    const user = rows[0];
    const match = await bcrypt.compare(contrasenna_hash, user.contrasenna_hash);

    if (!match) return res.status(401).json("Correo o contraseña incorrectos");

    const token = jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});
*/

// Login con correcciones aplicadas

app.post("/login", loginLimiter, async (req, res) => {
  const { correo, contrasenna_hash } = req.body;
  try {
    const { rows } = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]); // Se usa un parámetro en la consulta

    if (rows.length === 0) return res.status(401).json("Correo o contraseña incorrectos"); //

    const user = rows[0];
    const match = await bcrypt.compare(contrasenna_hash, user.contrasenna_hash);

    if (!match) return res.status(401).json("Correo o contraseña incorrectos");

    const token = jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});



// Nueva ruta para obtener los nombres de usuario
app.get("/usuarios", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT correo FROM usuarios");
    const nombresDeUsuario = rows.map(row => row.correo);
    res.json(nombresDeUsuario);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los nombres de usuario" });
  }
});



app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
