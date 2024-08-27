import Sequelize from 'sequelize';

import { sequelize } from '../db/index.js';

export const AdminUser = sequelize.define(
  'admin_users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN', 'SUPPORT'),
      defaultValue: 'SUPPORT',
      allowNull: false,
    },
    isBlocked: {
      type: Sequelize.BOOLEAN,
    },
    lastSeen: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: true,
  }
);
