// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
});

module.exports = User;
