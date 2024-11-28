const express = require("express");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");
const validatePassword = require("../components/validatePassword");
const validateEmail = require("../components/validateEmail");
const sendEmail = require("../components/sendEmail");

const router = express.Router();

router.post("/", async (req, res) => {
  let body_data;
  let db_client;

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

  const {
    client_id,
    username,
    password,
    confirm_password,
    otp,
    scope,
    fingerprint,
  } = body_data;

  // Basic Check

  if (!username || !password || !client_id) {
    res.status(500).json({
      error: "Internal Server Error",
      message: `The required credentials were not provided.`,
      detailed: `The required credentials were not provided.`,
      status: 500,
    });
    return;
  }

  // Check Client ID

  try {
    db_client = await req.db
      .db("auth_data")
      .collection("clients")
      .findOne({ _id: new ObjectId(client_id) });
  } catch (err) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The requested client_id : "${client_id}" is invalid.`,
      detailed: err,
      status: 401,
    });
    return;
  }

  if (db_client == null) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The requested client_id : "${client_id}" is invalid.`,
      detailed: `The requested client_id : "${client_id}" is invalid.`,
      status: 401,
    });
    return;
  }

  // Check Password

  if (password != confirm_password) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The provided passwords do not match.`,
      detailed: `The provided passwords do not match.`,
      status: 401,
    });
    return;
  }

  const passwordValidationData = validatePassword(password);

  if (!passwordValidationData.valid) {
    res.status(401).json({
      error: "Unauthorized",
      message: passwordValidationData.message,
      detailed: passwordValidationData.message,
      status: 401,
    });
    return;
  }

  // Email Validation

  const emailValidationData = validateEmail(username);

  if (!emailValidationData) {
    res.status(401).json({
      error: "Unauthorized",
      message: emailValidationData.message,
      detailed: emailValidationData.message,
      status: 401,
    });
    return;
  }

  // Check if User Exists

  const db_user = await req.db
    .db(db_client.client_name)
    .collection("users")
    .findOne({ username: username });

  if (db_user != null) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The requested user : "${username}" already exists.`,
      detailed: `The requested user : "${username}" already exists.`,
      status: 401,
    });
    return;
  }

  // OTP Validation

  const otp_data = await req.db
    .db(db_client.client_name)
    .collection("otps")
    .findOne({ username: username });

  if (!otp) {
    const new_otp = Math.floor(100000 + Math.random() * 900000);

    // Ensure the OTP field has db.otps.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 300 } ) already un while creation

    if (otp_data == null) {
      await req.db
        .db(db_client.client_name)
        .collection("otps")
        .insertOne({ username: username, otp: new_otp });
    } else {
      await req.db
        .db(db_client.client_name)
        .collection("otps")
        .findOneAndUpdate({ username: username }, { otp: new_otp });
    }

    const emailSentData = await sendEmail(
      username,
      `Your OTP for Registration on ${db_client.client_name}`,
      `Dear ${username},
    
    Thank you for registering on ${db_client.client_name}.
    
    Your One-Time Password (OTP) for completing the registration process is: ${new_otp}
    
    Please enter this OTP within the next 10 minutes to verify your account. If you did not request this, please ignore this email.
    
    Best regards,
    The ${db_client.client_name} Team
    `
    );

    if (emailSentData.error) {
      res.status(500).json({
        error: "Internal Server Error",
        message: emailSentData.message,
        detailed: emailSentData.detailed,
        status: 500,
      });
      return;
    } else {
      res.status(200).json({
        error: false,
        message: "Pending OTP Validation",
        status: 200,
        task: 1,
        auth_token: "",
        refresh_token: "",
      });
      return;
    }
  }

  if (otp_data.otp == otp) {
    await req.db.db(db_client.client_name).collection("users").insertOne({
      username: username,
      email: username,
      password: password,
      dateCreated: new Date(),
    });
    res.status(200).json({
      error: false,
      message: "registeration success",
      status: 200,
      auth_token: "",
      refresh_token: "",
      scope: scope,
    });
    return;
  } else {
    res.status(401).json({
      error: "Unauthorized",
      message: `The provided OTP is wrong.`,
      detailed: `The provided OTP is wrong.`,
      status: 401,
    });
    return;
  }
});

module.exports = router;
