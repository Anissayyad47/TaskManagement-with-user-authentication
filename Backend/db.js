const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(url)
    .then(() => console.log("Database connected"))
    .catch((err) => console.log("Failed to connect:", err));
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
