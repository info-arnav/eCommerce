const MongoClient = require("mongodb").MongoClient;

const connectionString = process.env.DATABASE_URI || "";

const middleware = async (req, res, next) => {
  let conn;

  try {
    const client = new MongoClient(connectionString);
    conn = await client.connect();
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      error: "Internal Server Error",
      message: `Connection to database failed, please check console for further details.`,
      status: 500,
    });
  }

  req.db = conn;

  next();
};

module.exports = middleware;
