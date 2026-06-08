const express = require("express");
const authMiddleware = require("../../middlewares/auth.middleware");
const dashboardController = require("./dashboard.controller");

const router = express.Router();

router.get("/", authMiddleware, dashboardController.obtener);

module.exports = router;