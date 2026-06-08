const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const usuariosController = require("./usuarios.controller");

const router = express.Router();

router.get("/me", authMiddleware, usuariosController.obtenerPerfil);

module.exports = router;