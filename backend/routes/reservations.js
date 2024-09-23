const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/', async(req, res) => {
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

  try {
    const results = await db.query(query, params);
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', async(req, res) => {
  try {
    const reservationId = req.params.id;
    const [results] = await db.query('SELECT * FROM reservations WHERE id = ?', [reservationId]);
    if (results.length === 0) {
      return res.status(404).send('Reservation not found');
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  const reservationId = req.params.id;
});

router.post('/', async(req, res) => {
  try {
    const payload = req.body;
    const [results] = await db.query('INSERT INTO reservations SET ?', payload)
    res.json({ id: results.insertId, ...payload });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error creating reservations');
  }
});

router.patch('/:id', async(req, res) => {
  try {
    const reservationId = req.params.id;
    const payload = req.body;
    await db.query('UPDATE reservations SET ? WHERE id = ?', [payload, reservationId]);
    res.json(payload);
  } catch (err) {
    return res.status(500).send('Error updating reservation');
  }
});

router.post('/delete-reservation', async(req, res) => {
  try {
    const {id} = req.body;
    const [result] = await db.query('UPDATE reservations SET isDeleted=? WHERE id = ?', [true, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Reservation not found');
    }
    res.send('Reservation deleted successfully'); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;