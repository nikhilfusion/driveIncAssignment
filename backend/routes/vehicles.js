const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { getAvailableSlots } = require('../helper/slots');

router.get('/', async(req, res) =>  {
  try {
    const { location, vehicleName } = req.query;
    let query = 'SELECT v.*, l.name FROM vehicles as v left join locations as l on v.locationId=l.id WHERE v.isActive=?';
    const params = [true];
    if (location && location !== 'undefined') {
      query += ' AND v.locationId = ?';
      params.push(parseInt(location, 10));
    }
    if(vehicleName && vehicleName !== 'undefined') {
      query += ' AND v.type LIKE ?';
      params.push(`%${vehicleName}%`);
    }
    console.log("query", query);
    console.log("params", params);
    const [results] = await db.execute(query, params);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get('/:id', async(req, res) =>  {
  try {
    const userId = req.params.id;
    const [results] = await db.query('SELECT * FROM vehicles WHERE id = ?', [userId]);
    if (results.length === 0) {
      return res.status(404).send('Vehicle not found');
    }
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/', async(req, res) =>  {
  try {
    const payload = req.body;
    const [results] = await db.query('INSERT INTO vehicles SET ?', payload)
    res.json({ id: results.insertId, ...payload });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Error creating vehicle');
  }
});

router.patch('/:id', async(req, res) =>  {
  try {
    const vehicleId = req.params.id;
    const payload = req.body;
    await db.query('UPDATE vehicles SET ? WHERE id = ?', [payload, vehicleId]);
    res.json(payload);
  } catch (err){
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/delete-vehicle', async(req, res) =>  {
  try {
    const {id} = req.body;
    const [result] = await db.query('UPDATE vehicles SET isActive=? WHERE id = ?', [false, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Vehicle not found');
    }
    res.send('Vehicle deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/get-slots', async(req, res) => {
  try {
    const { selectedVehicle, date} = req.body;
    const [results] = await db.query('SELECT * FROM reservations WHERE vehicleId = ? AND startTime > ? ', [selectedVehicle.id, date]);
    const slots = getAvailableSlots(selectedVehicle, date, results);
    res.json(slots);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
