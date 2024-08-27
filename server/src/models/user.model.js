import Sequelize from 'sequelize';

import { sequelize } from '../db/index.js';

export const User = sequelize.define(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
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
    gender: {
      type: Sequelize.ENUM('MALE', 'FEMALE', 'NON_BINARY', 'OTHER'),
      allowNull: true,
    },
    role: {
      type: Sequelize.ENUM('STUDENT'),
      defaultValue: 'STUDENT',
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
