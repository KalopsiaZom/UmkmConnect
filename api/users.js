const conn = require('./koneksi');

app.get('/api/users', (req, res) => {
  conn.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
