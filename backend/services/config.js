const {
  createLocationQuery,
  createVehicleQuery,
  createReservationQuery
} = require('../schema');
const db = require('../models/db');


const createDatabase = () => {
  return new Promise((resolve, reject) => {
    try {
      db.query("CREATE DATABASE IF NOT EXISTS driveInc", (err, results) => {
        if (err) {
          console.error(err);
          reject();
        }
        console.log("Database created successfully");
        resolve();
      });
    } catch (error) {
      console.error(error);
      reject();
    }
  });
};

const createTables = async() => {
  [
    createLocationQuery,
    createVehicleQuery,
    createReservationQuery
  ].map((query) => {
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Table created successfully");
    });
  });
};

module.exports = {
  createDatabase,
  createTables,
}
