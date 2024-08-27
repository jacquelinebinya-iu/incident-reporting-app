import { Op } from 'sequelize';

import { Incident } from '../../models/incident.model.js';
import { User } from '../../models/user.model.js';

export const INCIDENT_STATUS_ENUM = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

const fetchMetrics = async (req, res) => {
  try {
    // Query Total users
    const userCount = await User.count({
      where: {
        isBlocked: {
          [Op.or]: [false, null],
        },
      },
      raw: true,
    });

    // Incidents reported this month
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const reportedIncidentCount = await Incident.count({
      where: {
        createdAt: { [Op.gte]: firstDayOfMonth },
      },
    });

    // Incidents resolved this month
    const resolvedIncidentCount = await Incident.count({
      where: {
        status: { [Op.in]: [INCIDENT_STATUS_ENUM.RESOLVED, INCIDENT_STATUS_ENUM.CLOSED] },
        updatedAt: { [Op.gte]: firstDayOfMonth },
      },
    });

    // All pending incidents
    const pendingIncidentCount = await Incident.count({
      where: {
        status: { [Op.or]: [INCIDENT_STATUS_ENUM.OPEN, INCIDENT_STATUS_ENUM.IN_PROGRESS] },
      },
    });

    const TODAY_START = new Date();
    TODAY_START.setHours(0, 0, 0, 0);

    const START_OF_TOMORROW = new Date();
    START_OF_TOMORROW.setHours(24, 0, 0, 0);

    const newSignupsTodayCount = await User.count({
      where: {
        createdAt: {
          [Op.gt]: TODAY_START,
          [Op.lt]: START_OF_TOMORROW,
        },
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        userCount,
        pendingIncidentCount,
        reportedIncidentCount,
        resolvedIncidentCount,
        newSignupsTodayCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching metrics',
    });
  }
};

export { fetchMetrics };
