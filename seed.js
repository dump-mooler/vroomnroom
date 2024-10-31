const bcrypt = require("bcryptjs");
const sequelize = require("./config/database");
const User = require("./models/user");
const Category = require("./models/category");

async function seedAdmin() {
  try {
    const adminData = {
      username: "admin",
      password: "adminpassword",
      role: ["admin", "manager"],
    };

    await sequelize.sync();

    const existingAdmin = await User.findOne({
      where: { username: adminData.username },
    });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    await User.create({
      username: adminData.username,
      password: hashedPassword,
      role: adminData.role,
    });

    console.log("\nAdmin user created successfully!");
    console.log(
      `\nusername: ${adminData.username}\npassword: ${adminData.password}`
    );
    console.log("---------------------------------\n");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

async function seedManager() {
  try {
    const managerData = {
      username: "manager",
      password: "manpassword",
      role: ["manager"],
    };
    await sequelize.sync();

    const existingManager = await User.findOne({
      where: { username: managerData.username },
    });
    if (existingManager) {
      console.log("Manager user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(managerData.password, 10);

    await User.create({
      username: managerData.username,
      password: hashedPassword,
      role: managerData.role,
    });

    console.log("\nManager created successfully!");
    console.log(
      `\nusername: ${managerData.username}\npassword: ${managerData.password}`
    );
    console.log("---------------------------------\n");
  } catch (error) {
    console.error("Error creating manager user:", error);
  }
}

async function seedCategory() {
  const categories = [{ name: "House" }, { name: "Cars" }];
  
  try {
    const _categories = await Category.findAll();
    
    if (_categories.length) return

    for (let category of categories) {
      await Category.create(category);
    }
    console.log("\nDone creating categories");
  } catch (err) {}
}

module.exports = { seedAdmin, seedManager, seedCategory };
