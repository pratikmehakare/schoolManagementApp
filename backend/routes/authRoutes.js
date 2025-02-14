const express = require("express");
const { login, register } = require("../controllers/authController");
const { getUserDetails } = require("../controllers/userController");
const {auth} = require("../middleware/auth")
const route = express.Router();

route.post('/login',login)
route.post('/register',register)

//user
route.get('/getUserDeatils',auth,getUserDetails)

module.exports = route;