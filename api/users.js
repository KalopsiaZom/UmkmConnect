const express = require('express');
const router = express.Router();
const pool = require('../backend/koneksi'); // connect to MySQL

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, role, email FROM users');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
