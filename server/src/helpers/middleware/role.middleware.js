export const verifyByRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('[AUTH] Auth failed for request');
      return res.status(401).json({
        success: false,
        errorMessage: 'Authentication failed. No token provided.',
      });
    }

    const _allowedRoles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (_allowedRoles.includes(req.user.role)) {
      next();
    } else {
      console.log(
        `[AUTH] BLOCKED ROLE: ${req.user.role} not in exempted roles ${JSON.stringify(
          _allowedRoles
        )}`
      );
      return res.status(403).json({
        success: false,
        errorMessage: `The role ${req.user.role} is not allowed to perform this operation`,
      });
    }
  };
};
