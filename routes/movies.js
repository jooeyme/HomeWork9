var express = require("express");
var router = express.Router();
var pool = require("../query.js");


// Endpoint untuk mendapatkan semua data movies
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const startIndex = (page - 1) * limit;
    const query = 'SELECT * FROM movies OFFSET $1 LIMIT $2';
    const { rows } = await pool.query(query, [startIndex, limit]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint untuk membuat data movie baru
router.post('/', async (req, res) => {
  const { title, genres, year } = req.body;
  const query = 'INSERT INTO movies (title, genres, year) VALUES ($1, $2, $3)';
  await pool.query(query, [title, genres, year]);
  res.send('Movie created');
});

// Endpoint untuk menghapus data movie
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM movies WHERE id = $1', [id]);
  res.send('Movie deleted');
});

// Endpoint untuk memperbarui data movie
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, genres, year } = req.body;
  const query = 'UPDATE movies SET title = $1, genres = $2, year = $3 WHERE id = $4';
  await pool.query(query, [title, genres, year, id]);
  res.send('Movie updated');
});

module.exports = router;
