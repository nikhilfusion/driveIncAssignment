# EV Test Drive Scheduling Service

## Objective

The objective of this project is to build a service that provides on-demand scheduling of electric vehicle (EV) test drives to customers.

## Problem Statement

### Part 1: Backend Service

The backend service will provide the following two functions:

#### A: Request Vehicle Availability

- Check the availability of a vehicle for a given date, time, and location.
- Ensure that the vehicle of the specified type is available on the requested day at the requested location.
- Ensure that the vehicle is not already scheduled for a test drive at the requested dates.
- Distribute test drive requests evenly across available vehicles.

#### B: Schedule a Test Drive

- Reserve a vehicle slot if it is available.
  
### Request Example

**Request to Check Availability:**
```json
{
  "location": "Dublin",
  "vehicleType": "Volkswagen_ID4",
  "startDateTime": "2023-11-01T09:00:00Z"
}
```

**Request to Schedule a Test Drive:**
```json
{
  "vehicleId": "017",
  "startDateTime": "2023-11-01T09:00:00Z",
  "durationMins": 45,
  "customerName": "John Smith",
  "customerPhone": "+353851234567",
  "customerEmail": "John@Smith.com"
}
```json


### Part 2: Front-end UI Component
Functionality
Provide a simple front-end component that leverages the above backend services to allow users to book a test drive.
The vehicle type is configurable in the component, so users do not need to select it manually.
Allow bookings for test drives that are available for up to 14 days in the future.
Implementation
Use React (or any other preferred framework) to build the UI component.
Ensure the component interacts with the backend API to check vehicle availability and schedule test drives.


## Setup

To set up the project, follow the steps below:

### Prerequisites

Before running the project, make sure you have the following installed:

- Docker: [Download and Install Docker](https://docs.docker.com/get-docker/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nikhilfusion/driveIncAssignment.git
   ```

2. Navigate to the project directory:

   ```bash
   cd driveIncAssignment
   ```


3. Run the following command to build and start the Docker containers:

   ```bash
   docker-compose up --build
   ```

4. Login to MySQL using the specified port, username, and password:

   - Host: `localhost`
   - Port: `3307`
   - Username: `root`
   - Password: `pass123`

   You can use a MySQL client such as [MySQL Workbench](https://www.mysql.com/products/workbench/) or [phpMyAdmin](https://www.phpmyadmin.net/) to log in to the MySQL server.

6. Initialize the MySQL database by opening the following URL in your web browser:

   ```
      http://localhost:3001/settings
   ```
   and click the Buttons
   
   1. DB Initialization - To initialize the database
   2. Table Initialization - To Initialize the tables
   3. Fill Locations Data - To dump the locations data
   4. Fill Vehicles Data - To dump the vehicles data

   or you can run the script.sql to do the same.

7. Access the Booking by opening the following URL in your web browser:

   ```
   http://localhost:3001
   ```

In the Frontend there are 4 Pages

1. Home Page 
   ```
      http://localhost:3001
   ```
   Its for the customer to book the available time slot. Vehicles availabilities are based on location

2. Reservations
   ```
      http://localhost:3001/reservations
   ```
   This page for the Admin to review the reservations and delete if necessary

3. Vehicles
   ```
      http://localhost:3001/vehicles
   ```

   This page for the admin to CRUD Vehicles info

4. Settings
   ```
      http://localhost:3001/settings
   ```
   This page for the admin to setup the initial data.