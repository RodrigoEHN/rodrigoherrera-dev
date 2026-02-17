const express = require("express");
const router = express.Router();

const { loginUser, registerAdmin } = require("../controllers/authController");

router.post("/register", registerAdmin);
router.post("/login", loginUser);

module.exports = router;
