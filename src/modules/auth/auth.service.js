const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRepository = require("./auth.repository");

async function login({ login, password }) {
  const user = await authRepository.findUserByLogin(login);

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!validPassword) {
    throw new Error("Contraseña incorrecta");
  }

  const token = jwt.sign(
    {
      id: user.id,
      empresa_id: user.empresa_id,
      usuario: user.usuario,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      empresa_id: user.empresa_id,
      nombre: user.nombre,
      usuario: user.usuario,
      correo: user.correo,
    },
  };
}

module.exports = {
  login,
};