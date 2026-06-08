const ucmService = require("./ucm.service");

async function conectar(req, res, next) {
  try {
    const result = await ucmService.conectarUcm(req.user.empresa_id);

    res.json({
      ok: true,
      message: "Conexión UCM realizada correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
async function listarExtensiones(req, res, next) {
  try {
    const result = await ucmService.listarExtensionesUcm(req.user.empresa_id);

    res.json({
      ok: true,
      message: "Extensiones UCM obtenidas correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function sincronizarExtensiones(req, res, next) {
  try {
    const result =
      await ucmService.sincronizarExtensiones(
        req.user.empresa_id
      );

    res.json({
      ok: true,
      message: "Extensiones sincronizadas correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function obtenerCdr(req, res, next) {
  try {
    const result = await ucmService.obtenerCdr(
      req.user.empresa_id
    );

    res.json({
      ok: true,
      message: "CDR obtenido correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

async function sincronizarCdr(req, res, next) {
  try {
    const result =
      await ucmService.sincronizarCdr(
        req.user.empresa_id
      );

    res.json({
      ok: true,
      message: "CDR sincronizado correctamente",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  conectar,
  listarExtensiones,
  sincronizarExtensiones,
  obtenerCdr,
  sincronizarCdr,
};