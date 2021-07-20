const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const authRoutes = require("./routes/auth");
const tasksRoutes = require("./routes/tasks");

const app = express();
require("./models");

// Parse request body in JSON format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Define routes
app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);
// Start node app
app.listen(3000, () => {
  //console.log(`👌 Node instance running on port 3000.`);
});
