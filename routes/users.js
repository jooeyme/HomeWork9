var express = require("express");
var router = express.Router();
var pool = require("../query.js");
const { register, login } = require("../middleware/auth.js");
const { authenticateToken} = require("../middleware/auth.js");

router.post('/register',register);
router.post('/login',  login);

// Endpoint untuk mendapatkan semua data users
router.get('/all', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const query = 'SELECT * FROM users OFFSET $1 LIMIT $2';
    const { rows } = await pool.query(query, [startIndex, limit]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint untuk membuat data users baru
router.post('/', async (req, res) => {
  const { id, email, gender, password, role } = req.body;
  const query = 'INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)';
  await pool.query(query, [id, email, gender, password, role]);
  res.send('Users created');
});

// Endpoint untuk menghapus data movie
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.send('Users deleted');
});

// Endpoint untuk memperbarui data movie
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const {  email, gender, password, role } = req.body;
  const query = 'UPDATE users SET email = $1, gender = $2, password = $3, role = $4 WHERE id = $5';
  await pool.query(query, [ email, gender, password, role, id]);
  res.send('Users updated');
});
module.exports = router;
