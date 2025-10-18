const conn = require("./koneksi");

async function tampilUsers(callback) {
  try {
    const [results] = await conn.query("SELECT * FROM users");
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = tampilUsers;
