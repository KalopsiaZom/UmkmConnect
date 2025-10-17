const mysql = require("mysql2");

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bryant_inventory",
});

conn.connect((err) => {
  if (err) console.log(err);
  console.log("MySQL Connected...");
});

module.exports = conn;