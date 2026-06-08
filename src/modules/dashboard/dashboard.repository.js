const pool = require("../../config/db");

async function obtenerDashboard(empresaId) {
  const query = `
    SELECT fn_dashboard_empresa($1) AS dashboard;
  `;

  const { rows } = await pool.query(query, [empresaId]);

  return rows[0].dashboard;
}

module.exports = {
  obtenerDashboard,
};