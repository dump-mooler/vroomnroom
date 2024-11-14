const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING, // Storing roles as comma-separated values
    allowNull: false,
    get() {
      return this.getDataValue('role').split(',');
    },
    set(value) {
      this.setDataValue('role', value.join(','));
    },
  },
  phoneNumbers: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('phoneNumbers');
      return rawValue ? rawValue.split(',') : [];
    },
    set(value) {
      const phoneArray = Array.isArray(value) ? value : [];
      this.setDataValue('phoneNumbers', phoneArray.join(','));
    },
  },
});

module.exports = User;
