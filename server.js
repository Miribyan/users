const express = require("express");
const path = require("path");
const app = express();

require('dotenv').config();

const PORT = process.env.PORT || 3002;

// подключение к базе данных MySQL
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/some-data", (req, res) => {});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});


app.listen(PORT, () => {
  console.log(`App listening on port ${port}`);
});
