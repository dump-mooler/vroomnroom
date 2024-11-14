
const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const advertRoutes = require("./routes/advertRoutes");
const blogRoutes = require("./routes/blogRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cors = require("cors");


const { seedAdmin, seedManager, seedCategory } = require("./seed");

async function runSeeder() {
  await seedAdmin();
  await seedManager();
  await seedCategory();
}

runSeeder();

const app = express();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header', 'filters'],
}));

app.use("/uploads", express.static("uploads"));

app.use("/advert", advertRoutes); 
app.use("/category", categoryRoutes); 
app.use("/blogs", blogRoutes); 
app.use("/auth", authRoutes); 
app.use("/", uploadRoutes); 


// sequelize.sync({ force: true }).then(() => {
//   console.log("Database connected");
// });

// Sync database and start the server

sequelize.sync().then(() => {
  console.log("Database connected");
});

module.exports = app;
