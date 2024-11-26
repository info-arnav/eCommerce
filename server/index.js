// Imports
const express = require("express");
require("dotenv").config();
var cors = require("cors");
const signup = require("./routes/signup");
const signin = require("./routes/signin");
const authorize = require("./routes/authorize");
const token = require("./routes/token");
const mongo = require("./db/mongo");

// Routes
const app = express();

// Middlewares
app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded());

// Database
app.use(mongo);

// only POST method support added
app.all("*", (req, res, next) => {
  if (req.method !== "POST") {
    res.status(405).json({
      error: "Method Not Allowed",
      message: `The HTTP method "${req.method}" is not supported for the path: "${req.path}".`,
      status: 405,
    });
    return;
  }
  next();
});

// All Routes
app.use("/signup", signup);
app.use("/signin", signin);
app.use("/authorize", authorize);
app.use("/oauth/token", token);

// Invalid POST requests eliminated
app.post("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `The requested path: "${req.path}" is not available.`,
    status: 404,
  });
  return;
});

// Setup
app.listen(process.env.PORT, () => {
  console.log(`The app is running on port ${process.env.PORT}`);
});
