// Imports
const express = require("express");
require("dotenv").config();
var cors = require("cors");
const signup = require("./routes/authorize/signup");
const signin = require("./routes/authorize/signin");
const track = require("./routes/track");
const authorize = require("./routes/authorize");
const token = require("./routes/token");
const mongo = require("./db/mongo");
const getFingerprint = require("./components/getFingerprint");

// Routes
const app = express();

// Middlewares
app.use(cors());
app.use(express.text());
app.use(express.json());
app.use(express.urlencoded());

// Database
app.use(mongo);

// Body Parsing
app.use((req, res, next) => {
  let body_data;
  try {
    body_data = JSON.parse(req.body);
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: `The POST request body was invalid`,
      detailed: err,
      status: 500,
    });
    return;
  }
  const { fingerprint } = body_data;
  req.body_data = body_data;
  req.client_fingerprint = fingerprint;
  next();
});

// Client Details
app.use(async (req, res, next) => {
  req.ip = req.socket.remoteAddress; // req.headers["x-forwarded-for"]
  req.fingerprint = await getFingerprint(req);
  next();
});

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
app.use("/authorize/signup", signup);
app.use("/authorize/signin", signin);
app.use("/track", track);
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
