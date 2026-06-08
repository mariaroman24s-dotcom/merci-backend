const rolesRepository = require("../modules/roles/roles.repository");

function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const roles = await rolesRepository.getUserRoles(
        req.user.id
      );

      const hasRole = roles.some(
        (role) => role.nombre === roleName
      );

      if (!hasRole) {
        return res.status(403).json({
          ok: false,
          message: "No tienes permisos suficientes",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

function requirePermission(permissionKey) {
  return async (req, res, next) => {
    try {
      const permissions =
        await rolesRepository.getUserPermissions(
          req.user.id
        );

      const hasPermission =
        permissions.includes(permissionKey);

      if (!hasPermission) {
        return res.status(403).json({
          ok: false,
          message: "Permiso denegado",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  requireRole,
  requirePermission,
};