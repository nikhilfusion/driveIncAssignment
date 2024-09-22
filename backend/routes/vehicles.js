const express = require('express');
const router = express.Router();
const db = require('../models/db');
const { getAvailableSlots } = require('../helper/slots');
router.get('/', async(req, res) =>  {
  console.log("req.query", req.query);
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
  console.log("query", query, params);
  db.execute(query, params, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.json(results);
  })
});

router.get('/:id', async(req, res) =>  {
  const userId = req.params.id;
  db.query('SELECT * FROM vehicles WHERE id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching vehicle');
    }
    if (results.length === 0) {
      return res.status(404).send('Vehicle not found');
    }
    res.json(results[0]);
  });
});

router.post('/', async(req, res) =>  {
  const payload = req.body;
  db.query('INSERT INTO vehicles SET ?', payload, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error creating vehicle');
    }
    res.json({ id: results.insertId, ...payload });
  });
});

router.patch('/:id', async(req, res) =>  {
  const vehicleId = req.params.id;
  const payload = req.body;
  db.query('UPDATE vehicles SET ? WHERE id = ?', [payload, Number(vehicleId)], (err, results) => {
    if (err) {
      console.log("Err is ", err);
      return res.status(500).send('Error updating vehicle');
    }
    res.json(payload);
  });
});

router.post('/delete-vehicle', async(req, res) =>  {
  const {id} = req.body;
  db.query('UPDATE vehicles SET isActive=? WHERE id = ?', [false, id], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting vehicle');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Vehicle not found');
    }
    res.send('Vehicle deleted successfully');
  });
});

router.post('/get-slots', async(req, res) => {
  console.log("req.body", req.body);
    const { selectedVehicle, date} = req.body;
    console.log("selectedVehicle", selectedVehicle);
    console.log("date", date);
    db.query('SELECT * FROM reservations WHERE vehicleId = ? AND startTime > ? ', [selectedVehicle.id, date], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Error fetching reservations');
      }
      console.log
      const slots = getAvailableSlots(selectedVehicle, date, results);
      console.log("slots are ", slots);
      res.json(slots);
    }); 
});



module.exports = router;