const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', function(req, res) {
  const { location, startDateTime, endDateTime, customerName } = req.query;
// Initialize base query and params array
let query = 'SELECT r.*, v.type as vehicle, l.name as location FROM reservations as r left join vehicles as v on r.vehicleId=v.id left join locations as l on v.locationId=l.id WHERE isDeleted=0';
const params = [];

// Dynamically add query conditions based on the presence of query parameters
if (location && location !== 'undefined') {
  query += ' AND l.id = ?';
  params.push(location);
}

if (startDateTime && startDateTime !== 'undefined') {
  query += ' AND r.startTime >= ?';
  params.push(startDateTime);  // Expecting 'YYYY-MM-DD' format or ISO 8601 date string
}

if (endDateTime && endDateTime !== 'undefined') {
  query += ' AND r.endTime <= ?';
  params.push(endDateTime);  // Expecting 'YYYY-MM-DD' format or ISO 8601 date string
}

if (customerName && customerName !== 'undefined') {
  query += ' AND r.name LIKE ?';
  params.push(`%${customerName}%`);  // Use LIKE for partial matches
}

db.execute(query, params, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  })
});

router.get('/:id', function(req, res) {
  const reservationId = req.params.id;
  db.query('SELECT * FROM reservations WHERE id = ?', [reservationId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching reservation');
    }
    if (results.length === 0) {
      return res.status(404).send('Reservation not found');
    }
    res.json(results[0]);
  });
});

router.post('/', function(req, res) {
  const payload = req.body;
  db.query('INSERT INTO reservations SET ?', payload, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error creating reservations');
    }
    res.json({ id: results.insertId, ...payload });
  });
});

router.put('/:id', function(req, res) {
  const reservationId = req.params.id;
  const payload = req.body;
  db.query('UPDATE reservations SET ? WHERE id = ?', [payload, reservationId], (err, results) => {
    if (err) {
      return res.status(500).send('Error updating reservation');
    }
    res.json(payload);
  });
});

router.post('/delete-reservation', function(req, res) {
  const {id} = req.body;
  db.query('UPDATE reservations SET isDeleted=? WHERE id = ?', [true, id], (err, result) => {
    if (err) {
      console.log("err is ", err)
      return res.status(500).send('Error deleting reservation');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Reservation not found');
    }
    res.send('Reservation deleted successfully');
  });
});

module.exports = router;