const configuracionPbxRepository = require("./configuracionPbx.repository");

async function obtener(req, res, next) {
  try {
    const configuracion = await configuracionPbxRepository.obtenerPorEmpresa(
      req.user.empresa_id
    );

    res.json({
      ok: true,
      message: "Configuración PBX obtenida correctamente",
      data: configuracion || null,
    });
  } catch (error) {
    next(error);
  }
}

async function guardar(req, res, next) {
  try {
    const { api_url, api_usuario, api_password } = req.body;

    if (!api_url || !api_usuario || !api_password) {
      return res.status(400).json({
        ok: false,
        message: "api_url, api_usuario y api_password son obligatorios",
      });
    }

    const configuracion =
      await configuracionPbxRepository.guardarConfiguracion(
        req.user.empresa_id,
        req.body
      );

    res.status(201).json({
      ok: true,
      message: "Configuración PBX guardada correctamente",
      data: configuracion,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtener,
  guardar,
};