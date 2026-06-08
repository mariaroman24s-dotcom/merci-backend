const pool = require("../../config/db");

async function findUserByLogin(login) {
  const query = `
    SELECT
      u.id,
      u.empresa_id,
      u.nombre,
      u.usuario,
      u.correo,
      u.password_hash
    FROM usuarios u
    WHERE (
      u.usuario = $1
      OR u.correo = $1
    )
    AND u.deleted_at IS NULL
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [login]);

  return rows[0];
}

module.exports = {
  findUserByLogin,
};