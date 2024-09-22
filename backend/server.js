const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
const locations = require("./routes/locations");
const reservations = require("./routes/reservations");
const vehicles = require("./routes/vehicles");
// Create the Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/', routes);
app.use('/locations', locations);
app.use('/vehicles', vehicles);
app.use('/reservations', reservations);

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
