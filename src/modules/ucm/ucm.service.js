const axios = require("axios");
const crypto = require("crypto");
const https = require("https");
const extensionesRepository = require("../extensiones/extensiones.repository");
const configuracionPbxRepository = require("../configuracion-pbx/configuracionPbx.repository");
const llamadasRepository = require("../llamadas/llamadas.repository");

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

function md5(value) {
  return crypto.createHash("md5").update(value).digest("hex");
}

async function conectarUcm(empresaId) {
  const config = await configuracionPbxRepository.obtenerPorEmpresa(empresaId);

  if (!config) {
    const error = new Error("Primero guarda la configuración PBX/UCM");
    error.status = 400;
    throw error;
  }

  const baseUrl = config.api_url.replace(/\/$/, "");

  const passwordQuery = `
    SELECT credenciales->>'password' AS password
    FROM configuraciones_pbx
    WHERE id = $1
  `;

  const pool = require("../../config/db");
  const { rows } = await pool.query(passwordQuery, [config.id]);
  const apiPassword = rows[0]?.password;

  if (!apiPassword) {
    const error = new Error("No se encontró la contraseña del UCM");
    error.status = 400;
    throw error;
  }

  const challengeResponse = await axios.get(`${baseUrl}/cgi`, {
    params: {
      action: "challenge",
      user: config.api_usuario,
    },
    httpsAgent,
  });

  const challenge = challengeResponse.data?.response?.challenge;

  if (!challenge) {
    const error = new Error("No se pudo obtener challenge del UCM");
    error.status = 400;
    throw error;
  }

  const token = md5(challenge + apiPassword);

  const loginResponse = await axios.get(`${baseUrl}/cgi`, {
    params: {
      action: "login",
      user: config.api_usuario,
      token,
    },
    httpsAgent,
  });

  const cookie = loginResponse.headers["set-cookie"];

  return {
    status: loginResponse.data?.status,
    response: loginResponse.data?.response,
    cookie,
  };
}

async function listarExtensionesUcm(empresaId) {
  const login = await conectarUcm(empresaId);

  const config = await configuracionPbxRepository.obtenerPorEmpresa(empresaId);
  const baseUrl = config.api_url.replace(/\/$/, "");

  const cookieHeader = Array.isArray(login.cookie)
    ? login.cookie.map((c) => c.split(";")[0]).join("; ")
    : "";

  const response = await axios.get(`${baseUrl}/cgi`, {
    params: {
      action: "listAccount",
    },
    headers: {
      Cookie: cookieHeader,
    },
    httpsAgent,
  });

  return {
    status: response.data?.status,
    total: response.data?.response?.account?.length || 0,
    extensiones: response.data?.response?.account || [],
  };
}

async function sincronizarExtensiones(empresaId) {
  const data = await listarExtensionesUcm(empresaId);

  const results = [];

  for (const extension of data.extensiones) {
    const saved =
      await extensionesRepository.upsertExtension(
        empresaId,
        extension
      );

    results.push(saved);
  }

  return {
    totalUcm: data.total,
    sincronizadas: results.length,
    extensiones: results,
  };
}

async function obtenerCdr(empresaId) {
  const login = await conectarUcm(empresaId);

  const config =
    await configuracionPbxRepository.obtenerPorEmpresa(empresaId);

  const baseUrl = config.api_url.replace(/\/$/, "");

  const cookieHeader = Array.isArray(login.cookie)
    ? login.cookie.map((c) => c.split(";")[0]).join("; ")
    : "";

  const response = await axios.get(`${baseUrl}/cgi`, {
    params: {
      action: "cdrapi",
      format: "json",
      numRecords: 50,
      offset: 0,
    },
    headers: {
      Cookie: cookieHeader,
    },
    httpsAgent,
  });

  return {
    status: response.data?.status,
    raw: response.data,
    registros:
      response.data?.response?.cdr_root ||
      response.data?.response?.cdr ||
      response.data?.cdr_root ||
      [],
  };
}

async function sincronizarCdr(empresaId) {
  const cdr = await obtenerCdr(empresaId);

  const results = [];

  for (const llamada of cdr.registros) {
    const saved =
      await llamadasRepository.upsertLlamada(
        empresaId,
        llamada
      );

    if (saved) {
      results.push(saved);
    }
  }

  return {
    totalUcm: cdr.registros.length,
    insertadas: results.length,
    llamadas: results,
  };
}

module.exports = {
  conectarUcm,
  listarExtensionesUcm,
  sincronizarExtensiones,
  obtenerCdr,
  sincronizarCdr,
};