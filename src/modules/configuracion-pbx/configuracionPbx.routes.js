const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const configuracionPbxController = require("./configuracionPbx.controller");

const router = express.Router();

router.get("/", authMiddleware, configuracionPbxController.obtener);
router.post("/", authMiddleware, configuracionPbxController.guardar);

module.exports = router;