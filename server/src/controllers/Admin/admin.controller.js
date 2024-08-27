import bcrypt from 'bcrypt';
import { formatDate } from 'date-fns';
import { Op } from 'sequelize';

import { ENUM_USER_ROLES,INCIDENT_STATUSES_ENUM } from '../../helpers/constants.js';
import { AdminUser } from '../../models/admin.model.js';
import { Incident } from '../../models/incident.model.js';

const inviteAdmin = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    // Validate input
    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Name, surname, email, and password are required.',
      });
    }

    // Check if the email is already in use
    const existingAdmin = await AdminUser.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        errorMessage: 'An admin with this email already exists.',
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin user
    const newAdmin = await AdminUser.create({
      name,
      surname,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newAdmin.id,
        name: newAdmin.name,
        surname: newAdmin.surname,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

const assignAdminToIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;
    const { role } = req.user;

    if (!id || !adminId)
      return res.status(400).json({
        success: false,
        errorMessage: 'The request cannot be processed missing credentials',
      });

    // Check if the user has permission to invite admins
    if (role !== ENUM_USER_ROLES.SUPER_ADMIN && role !== ENUM_USER_ROLES.ADMIN) {
      return res.status(403).json({
        success: false,
        errorMessage: 'Access denied. Only admins and super admins can invite other admins.',
      });
    }

    const incident = await Incident.findOne({
      where: {
        id: parseInt(id),
      },
    });

    await incident.update({
      assignedTo: parseInt(adminId),
    });

    await incident.save();
    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const incident = await Incident.findOne({
      where: {
        id: parseInt(id),
      },
    });

    await incident.update({
      status,
    });

    await incident.save();

    await incident.save();
    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

const closeIncidentStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await Incident.findOne({
      where: {
        id: parseInt(id),
      },
    });

    await incident.update({
      status: INCIDENT_STATUSES_ENUM.closed,
    });

    await incident.save();

    await incident.save();
    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await AdminUser.findAll({
      where: {
        [Op.or]: [{ isBlocked: false }, { isBlocked: null }],
      },
      attributes: ['id', 'name', 'surname', 'email', 'role', 'lastSeen', 'isBlocked'],
    });

    const adminResult = admins.map((admin) => ({
      ...admin.toJSON(),
      lastSeen: admin.lastSeen ? formatDate(admin.lastSeen, 'yyyy-MM-dd') : null,
    }));

    return res.status(200).json({
      success: true,
      data: adminResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

const blockAdmin = async (req, res) => {
  try {
    const { adminId } = req.body;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unable to process request - please provide the admin ID',
      });
    }

    const admin = await AdminUser.findByPk(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        errorMessage: 'The admin account is not found',
      });
    }

    await admin.update({ isBlocked: true });

    await admin.save();

    return res.status(200).json({
      success: true,
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isBlocked: admin.isBlocked,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, please try again later.',
    });
  }
};

export {
  assignAdminToIncident,
  blockAdmin,
  closeIncidentStatus,
  getAllAdmins,
  inviteAdmin,
  updateIncidentStatus,
};
