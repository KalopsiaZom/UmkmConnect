const conn = require("./koneksi");

async function tampilInvestorUsers(callback) {
  try {
    const [results] = await conn.query("SELECT id, user_id, company_name, investment_focus, capital, DATE_FORMAT(investment_date, '%Y-%m-%d') AS investment_date FROM investor");
    callback(null, results);
  } catch (err) {
    callback(err, null);
  }
}

module.exports = tampilInvestorUsers;
