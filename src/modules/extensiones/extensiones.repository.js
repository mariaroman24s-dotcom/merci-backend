const pool = require("../../config/db");

async function listarPorEmpresa(empresaId) {
  const query = `
    SELECT
      id,
      extension,
      nombre,
      correo,
      fecha_registro
    FROM extensiones
    WHERE empresa_id = $1
      AND deleted_at IS NULL
    ORDER BY extension ASC
  `;

  const { rows } = await pool.query(query, [empresaId]);
  return rows;
}

async function crear(empresaId, data) {
  const query = `
    INSERT INTO extensiones (
      empresa_id,
      extension,
      nombre,
      correo
    )
    VALUES ($1, $2, $3, $4)
    RETURNING id, empresa_id, extension, nombre, correo, fecha_registro
  `;

  const { rows } = await pool.query(query, [
    empresaId,
    data.extension,
    data.nombre || null,
    data.correo || null,
  ]);

  return rows[0];
}

async function upsertExtension(empresaId, extensionData) {
  const query = `
    INSERT INTO extensiones (
      empresa_id,
      extension,
      nombre,
      correo
    )
    VALUES (
      $1,
      $2,
      $3,
      $4
    )
    ON CONFLICT (empresa_id, extension)
    DO UPDATE SET
      nombre = EXCLUDED.nombre,
      correo = EXCLUDED.correo,
      fecha_actualizacion = NOW()
    RETURNING
      id,
      empresa_id,
      extension,
      nombre,
      correo,
      fecha_registro,
      fecha_actualizacion;
  `;

  const values = [
    empresaId,
    extensionData.extension,
    extensionData.fullname || extensionData.user_name || extensionData.userName || null,
    extensionData.email || null,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
}

module.exports = {
  listarPorEmpresa,
  crear,
  upsertExtension,
};