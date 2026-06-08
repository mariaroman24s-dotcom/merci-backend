const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const ucmController = require("./ucm.controller");

const router = express.Router();

router.post("/conectar", authMiddleware, ucmController.conectar);
router.get("/extensiones", authMiddleware, ucmController.listarExtensiones);

router.post(
  "/sincronizar-extensiones",
  authMiddleware,
  ucmController.sincronizarExtensiones
);

router.get(
  "/cdr",
  authMiddleware,
  ucmController.obtenerCdr
);

router.post(
  "/sincronizar-cdr",
  authMiddleware,
  ucmController.sincronizarCdr
);

module.exports = router;