import { format } from 'date-fns';

import {
  ENUM_USER_ROLES,
  INCIDENT_CATEGORIES,
  INCIDENT_STATUSES_ENUM,
} from '../../helpers/constants.js';
import { AdminUser } from '../../models/admin.model.js';
import { Incident } from '../../models/incident.model.js';
import { User } from '../../models/user.model.js';
import { formatDate, generateUniqueIncidentRef } from '../../utilities/index.js';

const createIncident = async (req, res) => {
  try {
    const { category, title, description, incidentDate, location, severityOption } = req.body;

    const severityOptions = Incident.rawAttributes.severity.values;
    const categories = Incident.rawAttributes.category.values;

    if (!categories) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported category type',
      });
    }

    if (severityOption && !severityOptions.includes(severityOption)) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported severity option',
      });
    }

    const reference = generateUniqueIncidentRef(req.user.id);

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Cannot process request',
      });
    }

    const incident = await Incident.create({
      reportedBy: req.user.id,
      category,
      title,
      description,
      incidentDate: formatDate(incidentDate),
      reference,
      location,
      severityOption,
    });

    await user.update({ lastSeen: new Date() });

    await user.save();

    return res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const incidents = async (req, res) => {
  try {
    const { role, id } = req.user;
    const { category, status } = req.query;
    const queryOptions = { where: {} };

    if (category) {
      if (!INCIDENT_CATEGORIES.includes(category)) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Unsupported category type',
        });
      }
      queryOptions.where.category = category;
    }

    if (status) {
      queryOptions.where.status = status;
    }

    if (role === ENUM_USER_ROLES.SUPER_ADMIN || role === ENUM_USER_ROLES.ADMIN) {
      const incidents = await Incident.findAll({
        ...queryOptions,
        include: [
          { model: User, as: 'reporter', attributes: ['name', 'surname'] },
          { model: AdminUser, as: 'assignee', attributes: ['name', 'surname'] },
        ],
        raw: true,
      });

      // Map to format createdAt date
      const data = incidents.map((el) => {
        const createdAt = format(el.createdAt, 'yyyy-MM-dd');
        return {
          ...el,
          reportedBy: `${el['reporter.name']} ${el['reporter.surname']}`,
          assignedTo: el.assignedTo ? `${el['assignee.name']} ${el['assignee.surname']}` : null,
          createdAt,
        };
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } else if (role === ENUM_USER_ROLES.SUPPORT) {
      queryOptions.where.assignedTo = req.user.id;
      const incidents = await Incident.findAll({
        ...queryOptions,
        include: [
          { model: User, as: 'reporter', attributes: ['name', 'surname'] },
          { model: AdminUser, as: 'assignee', attributes: ['name', 'surname'] },
        ],
        raw: true,
      });

      // Map to format createdAt date
      const data = incidents.map((el) => {
        const createdAt = format(el.createdAt, 'yyyy-MM-dd');
        return {
          ...el,
          reportedBy: `${el['reporter.name']} ${el['reporter.surname']}`,
          assignedTo: el.assignedTo ? `${el['assignee.name']} ${el['assignee.surname']}` : null,
          createdAt,
        };
      });

      return res.status(200).json({
        success: true,
        data,
      });
    } else if (role === ENUM_USER_ROLES.STUDENT) {
      queryOptions.where.reportedBy = id;
      const incidents = await Incident.findAll(queryOptions);

      return res.status(200).json({
        success: true,
        data: incidents,
      });
    } else {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported role type',
      });
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      errorMessage: 'Something went wrong, try again later...',
    });
  }
};

const fetchIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    if (!id) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Incident ID is required',
      });
    }

    let incident;

    if (role === ENUM_USER_ROLES.STUDENT) {
      incident = await Incident.findOne({
        where: { id: parseInt(id), reportedBy: parseInt(userId) },
        include: [
          { model: User, as: 'reporter' },
          { model: AdminUser, as: 'assignee' },
        ],
        raw: true,
      });
    } else if (role === ENUM_USER_ROLES.SUPER_ADMIN || role === ENUM_USER_ROLES.ADMIN) {
      incident = await Incident.findOne({
        where: { id: parseInt(id) },
        include: [
          { model: User, as: 'reporter' },
          { model: AdminUser, as: 'assignee' },
        ],
        raw: true,
      });
    } else if (role === ENUM_USER_ROLES.SUPPORT) {
      incident = await Incident.findOne({
        where: { id: parseInt(id), assignedTo: parseInt(req.user.id) },
        include: [
          { model: User, as: 'reporter' },
          { model: AdminUser, as: 'assignee' },
        ],
        raw: true,
      });
    } else {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported role type',
      });
    }

    if (!incident) {
      return res.status(404).json({
        success: false,
        errorMessage: 'Incident not found',
      });
    }

    // Format dates
    incident.incidentDate = format(incident.incidentDate, 'd MMMM, yyyy');

    if (incident.resolutionDate) {
      incident.resolutionDate = format(incident.resolutionDate, 'd MMMM yyyy');
    }
    if (incident.inProgressDate) {
      incident.inProgressDate = format(incident.inProgressDate, 'd MMMM yyyy');
    }
    if (incident.closureDate) {
      incident.closureDate = format(incident.closureDate, 'd MMMM yyyy');
    }

    return res.status(200).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const assignIncidentToStaff = async () => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorMessage: 'Something wrong happened, try again later...',
    });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    // Validate id and status
    const { status, id } = req.body;
    const user = req.user;

    if (!INCIDENT_STATUSES_ENUM.includes(status)) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Unsupported status type',
      });
    }

    const [affectedRows] = await Incident.update(
      { status },
      {
        where: {
          id,
        },
      }
    );

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        errorMessage: 'Incident not found',
      });
    }

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

const editIncident = async (req, res) => {
  try {
    const { category, title, description } = req.body;

    const { id } = req.params;

    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;

    const incident = await Incident.findOne({
      where: {
        id: parseInt(id),
      },
    });

    const user = await User.findOne({ where: { id: req.user.id } });
    if (!user || !incident) {
      return res.status(400).json({
        success: false,
        errorMessage: 'Cannot process request',
      });
    }
    // Edit Incident
    await incident.update({ ...updateData });

    await incident.save();

    // Update last seen
    await user.update({ lastSeen: new Date() });

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

const fetchCategories = async (req, res) => {
  try {
    const categories = Incident.rawAttributes.category.values;
    return res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

const fetchSeverityOptions = async (req, res) => {
  try {
    const severityOptions = Incident.rawAttributes.severity.values;
    return res.status(200).json({ severityOptions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching severity options', error });
  }
};

export {
  assignIncidentToStaff,
  createIncident,
  editIncident,
  fetchCategories,
  fetchIncidentById,
  fetchSeverityOptions,
  incidents,
  updateIncidentStatus,
};
