const pool = require("../../config/db");

async function getUserRoles(userId) {
  const query = `
    SELECT
      r.id,
      r.nombre,
      r.descripcion
    FROM usuario_roles ur
    INNER JOIN catalogo_roles r
      ON ur.rol_id = r.id
    WHERE ur.usuario_id = $1
      AND r.deleted_at IS NULL
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows;
}

async function getUserPermissions(userId) {
  const query = `
    SELECT DISTINCT
      p.clave
    FROM usuario_roles ur
    INNER JOIN roles_permisos rp
      ON ur.rol_id = rp.rol_id
    INNER JOIN permisos p
      ON rp.permiso_id = p.id
    WHERE ur.usuario_id = $1
      AND p.deleted_at IS NULL
  `;

  const { rows } = await pool.query(query, [userId]);

  return rows.map((p) => p.clave);
}

module.exports = {
  getUserRoles,
  getUserPermissions,
};