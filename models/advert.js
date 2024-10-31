const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('../models/category')

const Advert = sequelize.define('Advert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attrs: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
        const rawValue = this.getDataValue('attrs');
        return typeof rawValue === 'string' ? JSON.parse(rawValue) : rawValue;
    },
    set(value) {
        this.setDataValue('attrs', JSON.stringify(value))
    },
  },
});

Advert.belongsTo(Category, { foreignKey: 'category' });
Category.hasMany(Advert, { foreignKey: 'category' });

module.exports = Advert;