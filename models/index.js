const Advert = require("./advert");
const Category = require("./category");
const User = require('./user');

Advert.belongsTo(Category, { foreignKey: "category" });
Category.hasMany(Advert, { foreignKey: "category" });

Advert.belongsTo(User, { foreignKey: "posterId" });
User.hasMany(Advert, { foreignKey: "posterId" });

module.exports = { Advert, Category, User };