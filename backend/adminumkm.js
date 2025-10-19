const conn = require("./koneksi");

async function tampilumkmUsers(callback) {
  try {
    const [results] = await conn.query("SELECT * FROM umkm");
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = tampilumkmUsers;
