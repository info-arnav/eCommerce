const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  let data = await req.db.db("nebulus").collection("otps").insertOne({
    hi: 1234,
    dateCreated: new Date(),
  });
  console.log(JSON.stringify(data.insertedId));
  res.json({ data: "Working" });
});

module.exports = router;
