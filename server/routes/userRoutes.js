const express = require('express');
const router = express.Router();


const {
  fetchData
} = require("../controllers/dataController");

const {
    signup,
    login,
  } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.post("/fetchData", fetchData);

module.exports = router;