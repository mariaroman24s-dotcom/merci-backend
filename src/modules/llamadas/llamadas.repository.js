const pool = require("../../config/db");

async function upsertLlamada(empresaId, cdr) {
  const query = `
    INSERT INTO llamadas_ucm (
      empresa_id,
      uniqueid,
      extension_origen,
      extension_destino,
      numero_origen,
      numero_destino,
      tipo_llamada,
      estado,
      fecha_inicio,
      fecha_fin,
      duracion_segundos,
      metadata
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12
    )
    ON CONFLICT (uniqueid)
    DO NOTHING
    RETURNING *;
  `;

  const values = [
    empresaId,
    cdr.uniqueid || null,
    cdr.src || null,
    cdr.dst || null,
    cdr.src || null,
    cdr.dst || null,
    cdr.type || null,
    cdr.disposition || null,
    cdr.start || null,
    cdr.end || null,
    parseInt(cdr.duration || 0),
    cdr,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
}

module.exports = {
  upsertLlamada,
};