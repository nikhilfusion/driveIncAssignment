const mysql = require("mysql2");
// Create a connection to the MySQL database
const mysqlConfig = {
  host: process.env.DB_HOST || "db",
  // enable this line when you connect to localhost
  // host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "3306",
  // port: process.env.DB_PORT || "3307",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "pass123",
  database: process.env.DB_NAME || "driveInc",
  waitForConnections: true,
  connectionLimit: 10, // Number of connections in the pool
  queueLimit: 0       // Unlimited query queue
};

// const connection = mysql.createConnection(mysqlConfig);

// // Connect to the database
// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err.stack);
//     return;
//   }
//   console.log('Connected to MySQL');
// });

// module.exports = connection;


// Create a MySQL connection pool
const pool = mysql.createPool(mysqlConfig);

// Export the pool for use in other files
module.exports = pool.promise();