const dashboardRepository = require("./dashboard.repository");

async function obtener(req, res, next) {
  try {
    const dashboard = await dashboardRepository.obtenerDashboard(
      req.user.empresa_id
    );

    res.json({
      ok: true,
      message: "Dashboard obtenido correctamente",
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtener,
};