require("dotenv").config();

const prisma = require("./config/prisma");

async function main() {
  console.log("Probando Prisma...\n");

  const usuarios = await prisma.usuarios.findMany({
    select: {
      id: true,
      nombre: true,
      usuario: true,
      correo: true,
      empresa_id: true,
    },
  });

  console.log("Usuarios encontrados:");
  console.log(usuarios);
}

main()
  .catch((error) => {
    console.error("Error Prisma:");
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });