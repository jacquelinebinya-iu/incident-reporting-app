import Sequelize from 'sequelize';

import { sequelize } from '../db/index.js';
import { AdminUser } from './admin.model.js';
import { User } from './user.model.js';

export const Incident = sequelize.define(
  'incidents',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: Sequelize.ENUM,
      values: [
        'Academic Issues',
        'Facilities Issues',
        'IT and Technical Support',
        'Health and Safety',
        'Behavioral Concerns',
        'Security Incidents',
        'Student Welfare',
        'Event-Related Incidents',
        'Administrative and Financial Issues',
        'Other',
      ],
      allowNull: false,
      defaultValue: 'Other',
    },
    severity: {
      type: Sequelize.ENUM,
      values: ['Low', 'Medium', 'High', 'Critical'],
      allowNull: false,
      defaultValue: 'Medium',
    },
    reference: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    location: {
      type: Sequelize.STRING,
    },
    reportedBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assignedTo: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'admin_users',
        key: 'id',
      },
    },
    incidentDate: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    resolutionDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    inProgressDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    closureDate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    status: {
      type: Sequelize.ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
  },
  {
    timestamps: true,
  }
);

// Associations
Incident.belongsTo(User, { as: 'reporter', foreignKey: 'reportedBy' });
Incident.belongsTo(AdminUser, { as: 'assignee', foreignKey: 'assignedTo' });

User.hasMany(Incident, { foreignKey: 'reportedBy' });
AdminUser.hasMany(Incident, { foreignKey: 'assignedTo' });
