const {
  createLocationQuery,
  createVehicleQuery,
  createReservationQuery
} = require('../schema');
const db = require('../models/db');

const createDatabase = async() => {
  try {
    await db.query("CREATE DATABASE IF NOT EXISTS driveInc");
    console.log("Database created successfully");
  } catch (error) {
    console.error(error);
  }
}

const createTables = async() => {
  try {
    await db.query(createLocationQuery);
    await db.query(createVehicleQuery);
    await db.query(createReservationQuery);
    console.log("Tables created successfully");
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  createDatabase,
  createTables,
}
