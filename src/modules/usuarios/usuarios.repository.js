const prisma = require("../../config/prisma");

async function findByIdAndEmpresa(userId, empresaId) {
  return prisma.usuarios.findFirst({
    where: {
      id: userId,
      empresa_id: empresaId,
      deleted_at: null,
    },
    select: {
      id: true,
      empresa_id: true,
      nombre: true,
      usuario: true,
      correo: true,
      ultimo_acceso: true,
      fecha_registro: true,
    },
  });
}

module.exports = {
  findByIdAndEmpresa,
};