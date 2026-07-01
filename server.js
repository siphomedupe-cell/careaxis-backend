require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post("/register", async (req, res) => {
  const { username, password, hospitalName } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const hospital = await pool.query(
    "INSERT INTO hospitals(name) VALUES($1) RETURNING *",
    [hospitalName]
  );

  const user = await pool.query(
    "INSERT INTO users(username,password,role,hospital_id) VALUES($1,$2,$3,$4) RETURNING *",
    [username, hashed, "Executive", hospital.rows[0].id]
  );

  res.json(user.rows[0]);
});

app.get("/", (req, res) => {
  res.send("CareAxis API running");
});

app.listen(5000, () => console.log("Server running"));
