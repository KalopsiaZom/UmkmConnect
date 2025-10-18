const pool = require('./koneksi');
const bcrypt = require('bcryptjs');

async function registerUser(req, res) {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', async () => {
    const { username, password, role } = JSON.parse(body);

    if (!username || !password) {
      res.writeHead(400);
      return res.end('Missing fields');
    }

    try {
      const [exist] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (exist.length > 0) {
        res.writeHead(400);
        return res.end('Username already exists');
      }

      const hash = await bcrypt.hash(password, 10);
      const userRole = role && role === 'admin' ? 'admin' : 'member';

      await pool.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [username, hash, userRole]
      );

      res.writeHead(200);
      res.end('Registration successful');
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      res.end('Database error');
    }
  });
}

module.exports = registerUser;
