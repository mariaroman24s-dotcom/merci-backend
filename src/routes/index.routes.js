const express = require("express");
const authRoutes = require("../modules/auth/auth.routes");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const usuariosRoutes = require("../modules/usuarios/usuarios.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");
const extensionesRoutes = require("../modules/extensiones/extensiones.routes");
const ucmRoutes = require("../modules/ucm/ucm.routes");
const configuracionPbxRoutes = require("../modules/configuracion-pbx/configuracionPbx.routes");

const {
  requireRole,
} = require("../middlewares/roles.middleware");

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    message: "API saludable",
  });
});

router.get(
  "/perfil",
  authMiddleware,
  (req, res) => {
    res.json({
      ok: true,
      message: "Ruta privada funcionando",
      user: req.user,
    });
  }
);

router.get(
  "/admin-test",
  authMiddleware,
  requireRole("Super Administrador"),
  (req, res) => {
    res.json({
      ok: true,
      message: "Ruta solo admin funcionando",
    });
  }
);

router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/configuracion-pbx", configuracionPbxRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/extensiones", extensionesRoutes);
router.use("/ucm", ucmRoutes);

module.exports = router;