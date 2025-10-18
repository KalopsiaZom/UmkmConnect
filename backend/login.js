const pool = require('./koneksi');
const bcrypt = require('bcryptjs');

async function loginUser(req, res) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    const { username, email, password } = JSON.parse(body);

    if (!username || !email || !password) {
      res.writeHead(400);
      return res.end('Missing fields');
    }

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }

      const [rows2] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows2.length === 0) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }

      // Return username and role
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Login successful', role: user.role }));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Database error' }));
    }
  });
}

module.exports = loginUser;
