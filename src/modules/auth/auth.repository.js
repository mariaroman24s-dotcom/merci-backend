const prisma = require("../../config/prisma");

async function findUserByLogin(login) {
  return prisma.usuarios.findFirst({
    where: {
      deleted_at: null,
      OR: [
        { usuario: login },
        { correo: login },
      ],
    },
    select: {
      id: true,
      empresa_id: true,
      nombre: true,
      usuario: true,
      correo: true,
      password_hash: true,
    },
  });
}

module.exports = {
  findUserByLogin,
};