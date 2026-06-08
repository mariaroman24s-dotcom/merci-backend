const pool = require("../../config/db");

async function obtenerPorEmpresa(empresaId) {
  const query = `
    SELECT
      id,
      empresa_id,
      proveedor,
      api_url,
      api_usuario,
      auth_tipo,
      activo,
      fecha_registro,
      fecha_actualizacion
    FROM configuraciones_pbx
    WHERE empresa_id = $1
      AND deleted_at IS NULL
    ORDER BY fecha_registro DESC
    LIMIT 1
  `;

  const { rows } = await pool.query(query, [empresaId]);
  return rows[0];
}

async function guardarConfiguracion(empresaId, data) {
  const {
    api_url,
    api_usuario,
    api_password,
    auth_tipo = "md5_token",
  } = data;

  const query = `
    INSERT INTO configuraciones_pbx (
      empresa_id,
      proveedor,
      api_url,
      api_usuario,
      auth_tipo,
      credenciales,
      activo
    )
    VALUES (
      $1,
      'grandstream',
      $2,
      $3,
      $4,
      jsonb_build_object('password', $5::text),
      true
    )
    RETURNING
      id,
      empresa_id,
      proveedor,
      api_url,
      api_usuario,
      auth_tipo,
      activo,
      fecha_registro
  `;

  const { rows } = await pool.query(query, [
    empresaId,
    api_url,
    api_usuario,
    auth_tipo,
    api_password,
  ]);

  return rows[0];
}

module.exports = {
  obtenerPorEmpresa,
  guardarConfiguracion,
};