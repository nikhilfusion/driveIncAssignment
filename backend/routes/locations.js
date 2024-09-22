const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', function(req, res) {
  db.query("SELECT * FROM locations where isActive=?", [true], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  })
});

router.get('/:id', function(req, res) {
  const locationId = req.params.id;
  db.query('SELECT * FROM locations WHERE id = ?', [locationId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching location');
    }
    if (results.length === 0) {
      return res.status(404).send('Location not found');
    }
    res.json(results[0]);
  });
});

router.post('/', function(req, res) {
  const payload = req.body;
  db.query('INSERT INTO locations SET ?', payload, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error creating location');
    }
    res.json({ id: results.insertId, ...payload });
  });
});

router.put('/:id', function(req, res) {
  const locationId = req.params.id;
  const payload = req.body;
  db.query('UPDATE locations SET ? WHERE id = ?', [payload, locationId], (err, results) => {
    if (err) {
      return res.status(500).send('Error updating location');
    }
    res.json(payload);
  });
});

router.put('delete-location', function(req, res) {
  const {id} = req.body
  db.query('UPDATE locations SET isActive=? WHERE id = ?', [false, id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting location');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Location not found');
    }
    res.send('Location deleted successfully');
  });
});

module.exports = router;