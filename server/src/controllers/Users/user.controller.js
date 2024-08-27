import { formatDate } from 'date-fns';
import { Op } from 'sequelize';

import { ENUM_USER_ROLES } from '../../helpers/constants.js';
import { AdminUser } from '../../models/admin.model.js';
import { User } from '../../models/user.model.js';

const editProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        successs: false,
        errorMessage: 'Resource not found',
      });
    }

    const updateData = {};

    const updatableFields = ['name', 'surname', 'gender'];

    updatableFields.forEach((field) => {
      if (req.body[field] && user[field] !== req.body[field]) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        errorMessage: 'No valid fields provided for update',
      });
    }

    await user.update({ ...updateData });

    await user.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const fetchUserById = async (req, res) => {
  console.log('XXXXX::::Fetch user by id');
  try {
    if (req.user.role === ENUM_USER_ROLES.STUDENT && req.user.id != req.params.id) {
      return res.status(403).json({
        success: false,
        errorMessage: 'Unauthourised access',
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        successs: false,
        errorMessage: 'Resource not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const fetchCurrentUser = async (req, res) => {
  try {
    const { role } = req.user;

    if (role === ENUM_USER_ROLES.STUDENT) {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'surname', 'email', 'role', 'gender', 'lastSeen'],
      });

      if (!user) {
        return res.status(403).json({
          successs: false,
          errorMessage: 'Unauthourised access',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } else {
      const admin = await AdminUser.findByPk(req.user.id, {
        attributes: ['id', 'name', 'surname', 'email', 'role', 'lastSeen'],
      });
      if (!admin) {
        return res.status(403).json({
          success: false,
          errorMessage: 'Unauthourised access',
        });
      }

      return res.status(200).json({
        success: true,
        data: admin,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        isBlocked: {
          [Op.or]: [null, false],
        },
      },
      attributes: ['id', 'name', 'surname', 'email', 'role', 'lastSeen'],
    });

    let usersResult = [];

    if (users.length > 0) {
      usersResult = users.map((el) => {
        const user = el.toJSON();

        return {
          ...user,
          lastSeen: user.lastSeen ? formatDate(user.lastSeen, 'yyyy-MM-dd') : null,
        };
      });
    }

    return res.status(200).json({
      success: true,
      data: usersResult,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const blockUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        successs: false,
        errorMessage: 'The account is not found',
      });
    }

    await user.update({ isBlocked: true });

    await user.save();

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!ROLES_ENUM.includes(role.trim().toUpperCase())) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported role type',
      });
    }

    const user = await User.findByPk(req.user);

    if (!user) {
      return res.status(404).json({
        successs: false,
        errorMessage: 'Resource not found',
      });
    }

    await user.update({ role: role.trim().toUpperCase() });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

export { blockUser, editProfile, fetchCurrentUser, fetchUserById, getAllUsers, updateUserRole };
