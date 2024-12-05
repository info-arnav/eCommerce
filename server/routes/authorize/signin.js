const express = require("express");
const argon2 = require("argon2");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.post("/", async (req, res) => {
  let db_client;

  let { username, password, client_id, scope, redirect_uri } = req.body_data;

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

  // Check if User Exists

  let db_user = await req.db
    .db(db_client.client_name)
    .collection("users")
    .findOne({ username: username });

  if (db_user == null) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The requested user : "${username}" does not exist.`,
      detailed: `The requested user : "${username}" does not exist.`,
      status: 401,
    });
    return;
  }

  // Validate Password

  if (!(await argon2.verify(db_user.password, password))) {
    res.status(401).json({
      error: "Unauthorized",
      message: `The provided password was incorrect.`,
      detailed: `The provided password was incorrect.`,
      status: 401,
    });
    return;
  }

  // Authorization Code

  // Ensure the following config is set : db.session_ids.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 60 } )

  const session_data = await req.db
    .db(db_client.client_name)
    .collection("session_ids")
    .insertOne({
      fingerprint: req.fingerprint,
      username: username,
      ip: req.ip,
      scope: scope,
      dateCreated: new Date(),
    });

  auth_code_data.insertedId = JSON.stringify(session_data.insertedId);

  // Token

  const accesss_code_data = fetch(`${process.env.URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "auth_code",
      auth_code: auth_code_data.insertedId,
      fingerprint: req.fingerprint,
      client_id: client_id,
      username: username,
      scope: scope,
    }),
  });

  // Final Response

  res.set("Authorization", `Bearer ${accesss_code_data.access_code}`);

  res.status(200).json({
    error: false,
    message: "login success",
    detailed: "login sucess",
    status: 200,
    expires_in: 3600,
    refresh_token: "",
    token_type: "bearer",
    scope: scope,
    redirect_uri: redirect_uri,
  });
  return;
});

module.exports = router;
