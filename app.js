// app.js
const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const advertRoutes = require("./routes/advertRoutes");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cacheMiddleware = require("./middleware/cache")
const cors = require("cors");
const redis = require("redis");


const { seedAdmin, seedManager, seedCategory } = require("./seed");

async function runSeeder() {
  await seedAdmin();
  await seedManager();
  await seedCategory();
}

runSeeder();

const app = express();

// Middleware to parse JSON
app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'filters'],
}));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Routes with cache
app.use("/advert", cacheMiddleware(300), advertRoutes);  // Cache for 5 minutes
app.use("/category", cacheMiddleware(3600), categoryRoutes);  // Cache for 1 hour
app.use("/blogs", cacheMiddleware(600), blogRoutes);  // Cache for 10 minutes
app.use("/auth", authRoutes);  // No cache for auth routes
app.use("/", uploadRoutes);  // No cache for upload routes

// force //

// sequelize.sync({ force: true }).then(() => {
//   console.log("Database connected");
// });

// Sync database and start the server

sequelize.sync().then(() => {
  console.log("Database connected");
});

module.exports = app;
