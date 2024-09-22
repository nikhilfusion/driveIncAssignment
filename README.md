
### Objective
The objective of this project is to build a service that provides on-demand scheduling of electric vehicle (EV) test drives for customers. This service consists of a backend API for managing vehicle availability and scheduling test drives, along with a simple front-end user interface for booking.

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


7. Access the Booking by opening the following URL in your web browser:

   ```
   http://localhost:3001
   ```
