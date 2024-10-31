const Advert = require("./advert");
const Category = require("./category");

Advert.belongsTo(Category, { foreignKey: "category" });
Category.hasMany(Advert, { foreignKey: "category" });

module.exports = { Advert, Category };