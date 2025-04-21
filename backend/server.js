const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS para aceptar cualquier dominio
app.use(cors({
  origin: "*", // acepta cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false // debe estar en false si origin es "*"
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Limitador de login
const loginLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json("Demasiados intentos de inicio de sesión. Intenta nuevamente en 2 minutos.");
  }
});
app.use("/users/login", loginLimiter);

// Rutas
app.use("/products", require("./controllers/productController"));
app.use("/users", require("./controllers/userController"));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
