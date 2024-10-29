// seedAdmin.js
const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/user');

// Admin data
const adminData = {
  username: 'admin',
  password: 'adminpassword', // plaintext password
  role: ['admin', 'author'],
};

async function seedAdmin() {
  try {
    await sequelize.sync(); // Ensure the database is connected

    // Check if the admin already exists
    const existingAdmin = await User.findOne({ where: { username: adminData.username } });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Create the admin user
    await User.create({
      username: adminData.username,
      password: hashedPassword,
      role: adminData.role,
    });

    console.log('Admin user created successfully!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // await sequelize.close();
  }
}

module.exports = { seedAdmin };
