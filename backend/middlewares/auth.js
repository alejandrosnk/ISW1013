const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "secreto_super_seguro";

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

function autorizarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    next();
  };
}

module.exports = { autenticarToken, autorizarRol };
