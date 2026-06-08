const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const extensionesController = require("./extensiones.controller");

const router = express.Router();

router.get("/", authMiddleware, extensionesController.listar);
router.post("/", authMiddleware, extensionesController.crear);

module.exports = router;