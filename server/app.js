// ---------- External Imports ----------
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file



// ---------- Internal Imports ----------
const { fetchData } = require("./controllers/dataController");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");



// ---------- Connect to MongoDB -----------
const DB = process.env.DB_URL;
mongoose
  .connect(DB)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.log(err));



// ---------- Middlewares ----------
app.use(express.static('public'))
app.use(cors());
// if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));  // Use of Morgan middleware for logging
app.use(express.json()); // Middleware to parse JSON-encoded request body -- express.json({limit:'50KB'})

// // ---------- Rate Limiting ----------
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter); // Apply rate limiter to all requests




// ---------- Routes ----------
// Route Mounting
app.use("/user", userRouter);
app.post("/fetchPublications", fetchData);

app.get("/*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: "Invalid URL",
    });
});



// --------------------  GLOBAL ERROR HANDLER MIDDLEWARE   --------------------
// If any middleware calles next(err) then this middleware will be called.
app.use(globalErrorHandler);

module.exports = app;