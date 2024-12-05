const express = require("express");
const { ObjectId } = require("mongodb");

const router = express.Router();

router.post("/", async (req, res) => {
  let db_client;

  const { client_id, method, user_track_id, path } = req.body_data;

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

  // Session Queries

  const track_id = Array.from({ length: 10 }, () =>
    Math.random().toString(36).charAt(2)
  ).join("");

  const filters = {
    update: {
      device_id: req.fingerprint,
      "sessions.ip": req.ip,
    },
    create: {
      device_id: req.fingerprint,
      "sessions.ip": req.ip,
    },
  };

  const changes = {
    update: {
      start: {
        $set: {
          status: "open",
          "sessions.$.status": "open",
          "sessions.$.dateCreated": new Date(),
        },
        $addToSet: {
          "sessions.$.track_id": {
            track_id: track_id,
            date: new Date(),
          },
        },
      },
      update: {
        $set: {
          status: "open",
          "sessions.$.status": "open",
        },
        $addToSet: {
          "sessions.$.paths": {
            track_id: user_track_id,
            path: path,
            date: new Date(),
          },
        },
      },
      end: {
        $set: {
          status: "closed",
          "sessions.$.status": "closed",
          "sessions.$.dateEnded": new Date(),
        },
      },
    },
    create: {
      start: {
        $set: {
          status: "open",
          sessions: [
            {
              ip: req.ip,
              track_id: [{ track_id: track_id, date: new Date() }],
              dateCreated: new Date(),
              status: "open",
            },
          ],
        },
      },
      update: {
        $set: {
          status: "open",
          sessions: [
            {
              ip: req.ip,
              track_id: [{ track_id: user_track_id, date: new Date() }],
              status: "open",
              paths: [
                { track_id: user_track_id, path: path, date: new Date() },
              ],
              dateCreated: new Date(),
              status: "open",
            },
          ],
        },
      },
      end: {
        $set: {
          status: "closed",
          sessions: [
            {
              ip: req.ip,
              dateEnded: new Date(),
              status: "closed",
            },
          ],
        },
      },
    },
  };

  const options = { update: { upsert: false }, create: { upsert: true } };

  // Create a new Session

  if (method == "create") {
    await req.db
      .db(db_client.client_name)
      .collection("sessions")
      .findOneAndUpdate(filters.update, changes.update.start, options.update)
      .then(async (result) => {
        if (result == null) {
          await req.db
            .db(db_client.client_name)
            .collection("sessions")
            .updateOne(filters.create, changes.create.start, options.create);
        }
      });

    res.status(200).json({
      error: false,
      message: "track id created",
      status: 200,
      track_id: track_id,
    });
    return;
  }

  // Update path on an existing session
  else if (method == "update") {
    await req.db
      .db(db_client.client_name)
      .collection("sessions")
      .findOneAndUpdate(filters.update, changes.update.update, options.update)
      .then(async (result) => {
        if (result == null) {
          await req.db
            .db(db_client.client_name)
            .collection("sessions")
            .updateOne(filters.create, changes.create.update, options.create);
        }
      });

    res.status(200).json({
      error: false,
      message: "path added",
      status: 200,
      track_id: track_id,
    });
    return;
  }

  // End a session
  else if (method == "end") {
    await req.db
      .db(db_client.client_name)
      .collection("sessions")
      .findOneAndUpdate(filters.update, changes.update.end, options.update)
      .then(async (result) => {
        if (result == null) {
          await req.db
            .db(db_client.client_name)
            .collection("sessions")
            .updateOne(filters.create, changes.create.end, options.create);
        }
      });

    res.status(200).send("Session Ended");
    return;
  }

  // Invalid Actions
  else {
    res.status(401).json({
      error: "Unauthorized",
      message: `Inavlid method.`,
      detailed: `Inavlid method.`,
      status: 401,
    });
    return;
  }
});

module.exports = router;
