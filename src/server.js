require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Base de datos conectada correctamente");

    app.listen(PORT, () => {
      console.log(`Servidor MERCI corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:");
    console.error(error.message);
    process.exit(1);
  }
}

startServer();