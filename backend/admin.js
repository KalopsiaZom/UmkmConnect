const conn = require("./koneksi");

function tampilUsers(callback) {
  const sql = "SELECT * FROM users";
  conn.query(sql, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
}

module.exports = tampilUsers;
