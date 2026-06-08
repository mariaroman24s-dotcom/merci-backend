const pool = require("../../config/db");

async function findByIdAndEmpresa(userId, empresaId) {
  const query = `
    SELECT 
      id,
      empresa_id,
      nombre,
      usuario,
      correo,
      ultimo_acceso,
      fecha_registro
    FROM usuarios
    WHERE id = $1
      AND empresa_id = $2
      AND deleted_at IS NULL
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [userId, empresaId]);
  return rows[0];
}

module.exports = {
  findByIdAndEmpresa,
};