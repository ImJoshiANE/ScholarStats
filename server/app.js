// ---------- External Imports ----------
const cors = require('cors');
const rateLimit = require("express-rate-limit");6
// const mongoose = require("mongoose");

const express = require("express");
const app = express();


// ---------- Internal Imports ----------
const { fetchData } = require("./controllers/fetchData");

// ---------- Middlewares ----------
app.use(cors());
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'));  // Use of Morgan middleware for logging
app.use(express.json());  // Middleware to parse JSON-encoded request body -- express.json({limit:'50KB'})


app.post("/fetchPublications", fetchData);

app.listen(8080, () => {
    console.log("Server sterted at port 8080");
});

app.get("/", (req, res) => {
    res.send("Hi from the backend!");
})