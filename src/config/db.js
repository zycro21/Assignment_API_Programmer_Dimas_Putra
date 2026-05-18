const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  user: isProduction
    ? process.env.PGUSER
    : process.env.DB_USER,

  host: isProduction
    ? process.env.PGHOST
    : process.env.DB_HOST,

  database: isProduction
    ? process.env.PGDATABASE
    : process.env.DB_NAME,

  password: isProduction
    ? process.env.PGPASSWORD
    : process.env.DB_PASS,

  port: isProduction
    ? process.env.PGPORT
    : process.env.DB_PORT,

  // railway postgres biasanya butuh ssl
  ssl: isProduction
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

pool.connect()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error(
      "Database connection error:",
      err.message,
    );
  });

module.exports = pool;