
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Validate environment variables
if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not configured");
}

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// Health check API
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Management API is running"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found"
    });
});

// Start server after MongoDB connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
