const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async(req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM locations where isActive=?", [true]);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', async(req, res) => {
  const locationId = req.params.id;
  try {
    const [results] = await db.query('SELECT * FROM locations WHERE id = ?', [locationId]);
    if (results.length === 0) {
      return res.status(404).send('Location not found');
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/', async(req, res) => {
  try {
    const payload = req.body;
    const [results] = await db.query('INSERT INTO locations SET ?', payload)
    res.json({ id: results.insertId, ...payload });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error creating location');
  }
});

router.patch('/:id', async(req, res) => {
  try {
    const locationId = req.params.id;
    const payload = req.body;
    await db.query('UPDATE locations SET ? WHERE id = ?', [payload, locationId]);
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch('delete-location', async(req, res) => {
  try {
    const {id} = req.body
    const [result] = await db.query('UPDATE locations SET isActive=? WHERE id = ?', [false, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Location not found');
    }
    res.send('Location deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;