const createLocationQuery = `
  CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    isActive TINYINT(1) DEFAULT 1
  )
`;

const createVehicleQuery = `
  CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    locationId INT,
    FOREIGN KEY (locationId) REFERENCES locations(id) ON DELETE CASCADE ON UPDATE CASCADE,
    availableFromTime TIME NOT NULL,
    availableToTime TIME NOT NULL,
    availableDays JSON NOT NULL,
    minimumMinutesBetweenBookings INT NOT NULL,
    isActive TINYINT(1) DEFAULT 1
  )
`;

const createReservationQuery = `
  CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    vehicleId INT,
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    startTime DATETIME NOT NULL,
    endTime DATETIME NOT NULL,
    isDeleted TINYINT(1) DEFAULT 0
  )
`;

module.exports = {
  createLocationQuery,
  createVehicleQuery,
  createReservationQuery
}
