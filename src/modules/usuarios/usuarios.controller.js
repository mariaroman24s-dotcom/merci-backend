const usuariosRepository = require("./usuarios.repository");

async function obtenerPerfil(req, res, next) {
  try {
    const user = await usuariosRepository.findByIdAndEmpresa(
      req.user.id,
      req.user.empresa_id
    );

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      message: "Perfil obtenido correctamente",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerPerfil,
};