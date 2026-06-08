const extensionesRepository = require("./extensiones.repository");

async function listar(req, res, next) {
  try {
    const extensiones = await extensionesRepository.listarPorEmpresa(
      req.user.empresa_id
    );

    res.json({
      ok: true,
      message: "Extensiones obtenidas correctamente",
      data: extensiones,
    });
  } catch (error) {
    next(error);
  }
}

async function crear(req, res, next) {
  try {
    const { extension } = req.body;

    if (!extension) {
      return res.status(400).json({
        ok: false,
        message: "La extensión es obligatoria",
      });
    }

    const nuevaExtension = await extensionesRepository.crear(
      req.user.empresa_id,
      req.body
    );

    res.status(201).json({
      ok: true,
      message: "Extensión creada correctamente",
      data: nuevaExtension,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listar,
  crear,
};