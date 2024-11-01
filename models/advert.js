const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Category = require("../models/category");

const Advert = sequelize.define("Advert", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  category: {
    type: DataTypes.INTEGER,
    references: {
      model: Category,
      key: 'id'
    }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
  },
  level: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  media: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("media");
      return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    },
    set(value) {
      this.setDataValue("media", JSON.stringify(value));
    },
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
  attrs: {
    type: DataTypes.JSON,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue("attrs");
      return typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
    },
    set(value) {
      this.setDataValue("attrs", JSON.stringify(value));
    },
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

// Advert.belongsTo(Category, { foreignKey: "category" });

module.exports = Advert;
