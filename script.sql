-- Create the driveInc database
CREATE DATABASE IF NOT EXISTS driveInc;

-- Use the driveInc database
USE driveInc;


-- Create the locations table
CREATE TABLE `locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `driveInc`.`locations` (name, address, isActive)
VALUES
('Cork', '123 St Patrick\'s Street, Cork, Ireland', 1),
('Dublin', '45 O\'Connell Street, Dublin, Ireland', 1),
('Limerick', '12 Henry Street, Limerick, Ireland', 1),
('Galway', '78 Eyre Square, Galway, Ireland', 1),
('Waterford', '9 The Quay, Waterford, Ireland', 1);


=======================================================

-- Create the vehicles table
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `locationId` int DEFAULT NULL,
  `availableFromTime` time NOT NULL,
  `availableToTime` time NOT NULL,
  `availableDays` json NOT NULL,
  `minimumMinutesBetweenBookings` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `locationId` (`locationId`),
  CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`locationId`) REFERENCES `locations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `driveInc`.`vehicles` (type, locationId, availableFromTime, availableToTime, availableDays, minimumMinutesBetweenBookings)
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