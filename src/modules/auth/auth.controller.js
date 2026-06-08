const authService = require("./auth.service");

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);

    res.json({
      ok: true,
      message: "Login correcto",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
};