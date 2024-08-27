import { AdminUser } from '../../models/admin.model.js';
import { User } from '../../models/user.model.js';
import { ENUM_USER_ROLES } from '../constants.js';

export const validateUserAccess = async (req, res, next) => {
  const { id, role } = req.user;

  try {
    let user;

    if (
      role === ENUM_USER_ROLES.SUPER_ADMIN ||
      role === ENUM_USER_ROLES.ADMIN ||
      role === ENUM_USER_ROLES.SUPPORT
    ) {
      user = await AdminUser.findOne({ where: { id } });
    } else if (role === 'STUDENT') {
      user = await User.findOne({ where: { id } });
    } else {
      return res.status(403).json({
        success: false,
        errorMessage: 'Access Denied. Invalid user role.',
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        errorMessage: 'User not found.',
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        errorMessage: 'Access Denied. This user is blocked.',
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'An error occurred while checking user status.',
    });
  }
};
