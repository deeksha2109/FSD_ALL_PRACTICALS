const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/authcontroller");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Register
router.post(
    "/register",
    [
        check("name", "Name is required").notEmpty(),
        check("email", "Valid email is required").isEmail(),
        check("password", "Password must be 6+ characters").isLength({ min: 6 }),
    ],
    authController.register
);

// Login
router.post(
    "/login",
    [
        check("email", "Valid email is required").isEmail(),
        check("password", "Password is required").exists(),
    ],
    authController.login
);

// Protected: Dashboard
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
