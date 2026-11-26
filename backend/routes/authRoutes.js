const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

// Registration
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Protected profile
router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Authenticated user",
        user: req.user
    });
});

module.exports = router;