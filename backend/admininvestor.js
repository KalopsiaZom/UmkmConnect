const conn = require("./koneksi");

async function tampilInvestorUsers(callback) {
  try {
    const [results] = await conn.query("SELECT * FROM investor");
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = tampilInvestorUsers;
