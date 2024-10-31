// app.js
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const advertRoutes = require('./routes/advertRoutes');
const blogRoutes = require('./routes/blogRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const cors = require("cors")

const { seedAdmin } = require('./seedAdmin');

async function runSeeder() {
  await seedAdmin();
}

runSeeder();

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors());

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/advert', advertRoutes);
app.use('/blogs', blogRoutes);
app.use('/', uploadRoutes); // Added upload route

// force //

// sequelize.sync({ force: true }).then(() => {
  //   console.log('Database connected');
  // });
  
// Sync database and start the server
sequelize.sync().then(() => {
  console.log('Database connected');
});

module.exports = app;
