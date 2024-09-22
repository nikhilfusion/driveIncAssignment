const express = require('express');
const router = express.Router();
const { createDatabase, createTables} = require('../services/config');
const db = require('../models/db');

/* GET home page. */
router.get('/', function(req, res) {
  res.send('<h1>Hello World</h1>'); // Send HTML directly
});

router.post("/db-init", async(req, res) => {
  try {
    await createDatabase();
    res.json("Database created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/tb-init", async(req, res) => {
  try {
    await createTables();
    res.json("Table created successfully");
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post('/fill-locations', async(req, res) => {
  try {
    await createDatabase();
    await createTables();
  } catch(err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  const insertLocationsQuery = `
    INSERT INTO locations (name, address, isActive)
    VALUES 
    ('Cork', '123 St Patrick''s Street, Cork, Ireland', 1),
    ('Dublin', '45 O''Connell Street, Dublin, Ireland', 1),
    ('Limerick', '12 Henry Street, Limerick, Ireland', 1),
    ('Galway', '78 Eyre Square, Galway, Ireland', 1),
    ('Waterford', '9 The Quay, Waterford, Ireland', 1)
  `;

  db.query(insertLocationsQuery, (err, results) => {
    if (err) {
      console.error('Error inserting locations:', err); // Log the error
      // Ensure you return after sending the error response
      return res.status(500).json({ message: "Internal Server Error" });
    }
    // If no error, return success response
    res.status(200).json({ message: 'Locations inserted successfully', data: results });
  });
});

router.post('/fill-vehicles', async(req, res) => {
  try {
    await createDatabase();
    await createTables();
  } catch(err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
  const insertVehiclesQuery = `
  INSERT INTO vehicles (type, locationId, availableFromTime, availableToTime, availableDays, minimumMinutesBetweenBookings)
  VALUES
  ('Tesla Model 3', 1, '08:00:00', '18:00:00', '["Mon", "Tue", "Wed", "Thu", "Fri"]', 15),
  ('Tesla Model 3', 2, '09:00:00', '17:00:00', '["Mon", "Tue", "Wed", "Thu", "Fri"]', 20),
  ('Tesla Model Y', 1, '08:30:00', '16:30:00', '["Mon", "Wed", "Fri"]', 15),
  ('Tesla Model Y', 3, '10:00:00', '19:00:00', '["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]', 30),
  ('Tesla Model X', 2, '07:00:00', '15:00:00', '["Mon", "Tue", "Thu"]', 25),
  ('Tesla Model X', 3, '08:00:00', '17:00:00', '["Mon", "Wed", "Fri", "Sun"]', 10),
  ('Volkswagen ID.3', 1, '09:30:00', '18:00:00', '["Tue", "Wed", "Thu", "Sat"]', 20),
  ('Volkswagen ID.3', 2, '07:30:00', '16:30:00', '["Mon", "Tue", "Fri", "Sat"]', 15),
  ('Volkswagen ID.4', 3, '10:30:00', '19:30:00', '["Mon", "Thu", "Sun"]', 10),
  ('Volkswagen ID.4', 1, '09:00:00', '17:00:00', '["Mon", "Wed", "Fri", "Sat", "Sun"]', 20);
  `;

  db.query(insertVehiclesQuery, (err, results) => {
    if (err) {
      console.error('Error inserting vehicles:', err); // Log the error
      // Ensure you return after sending the error response
      return res.status(500).json({ message: "Internal Server Error" });
    }
    // If no error, return success response
    res.status(200).json({ message: 'vehicles inserted successfully', data: results });
  });
});

  
// });

module.exports = router;