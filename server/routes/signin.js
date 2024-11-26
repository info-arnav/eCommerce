const express = require("express");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

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

  let {
    username,
    password,
    response_type,
    client_id,
    fingerprint,
    redirect_uri,
    response_mode,
    scope,
    state,
    connection,
  } = body_data;

  if (!username || !password || !client_id) {
    res.status(500).json({
      error: "Internal Server Error",
      message: `The required credentials were not provided.`,
      status: 500,
    });
    return;
  }

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
      status: 401,
    });
    return;
  }

  let db_user = await req.db
    .db(db_client.client_name)
    .collection("users")
    .findOne({ username: username });

  if (db_user == null) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The requested user : "${username}" does not exist.`,
      status: 401,
    });
    return;
  }

  try {
    if (await argon2.verify(db_user.password, password)) {
      res.status(200).json({
        error: false,
        message: "login success",
        status: 200,
        auth_token: "",
        refresh_token: "",
      });
      return;
    } else {
      res.status(401).json({
        error: "Unauthorized",
        message: `The provided password was incorrect.`,
        status: 401,
      });
      return;
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error",
      message: `Some error occured, please try again later.`,
      detailed: err,
      status: 500,
    });
    return;
  }
});

module.exports = router;
