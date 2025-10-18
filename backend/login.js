const pool = require('./koneksi');
const bcrypt = require('bcryptjs');

async function loginUser(req, res) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    const { username, password } = JSON.parse(body);

    if (!username || !password) {
      res.writeHead(400);
      return res.end('Missing fields');
    }

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        res.writeHead(401);
        return res.end('Invalid credentials');
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.writeHead(401);
        return res.end('Invalid credentials');
      }

      res.writeHead(200);
      res.end('Login successful');
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end('Database error');
    }
  });
}

module.exports = loginUser;
