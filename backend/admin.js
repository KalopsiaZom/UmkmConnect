const conn = require("./koneksi");

async function tampilUsers(callback, search = "") {
  try {
    let query = "SELECT * FROM users";
    let params = [];

    if (search) {
      query += " WHERE username LIKE ? OR email LIKE ? OR role LIKE ?";
      params = [`%${search}%`, `%${search}%`, `%${search}%`];
    }

    const [results] = await conn.query(query, params);
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = tampilUsers;
