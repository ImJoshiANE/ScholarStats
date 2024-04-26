const app = require("./app"); // Import app from server/app.js

const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("Server sterted at port 8080");
});