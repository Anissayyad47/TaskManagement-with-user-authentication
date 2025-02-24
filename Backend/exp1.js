const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const Room = require("./RoomSchema");
require("dotenv").config();
const uuid = require("uuid").v4;
const connectDB=require("./db");

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

// AWS S3 Setup
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer Configuration
const storage = multer.memoryStorage(); // Store files in memory before uploading to S3
const upload = multer({ storage });

app.get("/rooms", async (req, res) => {
    try {
        const rooms = await Room.find(); // Fetch all room data from MongoDB
        res.json(rooms); // Send data as JSON response
    } catch (error) {
        console.error("Error fetching rooms:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// API Endpoint to Upload Image & Save Room Data
app.post("/upload", upload.array("images", 5), async (req, res) => {
    try {
        const { title, room_description, address, room_type, rent_price,parking, available_for, owner_contact, rules, water_and_electricity_supply, room_upload_data, lattitude, longitude,room_size, deposite } = req.body;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        // Upload images to S3
        const imageUrls = await Promise.all(files.map(async (file) => {
            const fileKey = `rooms/${uuid()}-${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            };

            await s3.send(new PutObjectCommand(uploadParams));
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        }));

        // Save room data in MongoDB
        const newRoom = new Room({
            title,
            room_description,
            address,
            room_type,
            rent_price,
            images: imageUrls,
            parking,
            available_for,
            owner_contact,
            rules,
            water_and_electricity_supply,
            room_upload_data,
            lattitude,
            longitude,
            deposite,
            room_size,
        });

        
        await newRoom.save();
        res.json({ message: "Room added successfully", room: newRoom });
    } catch (error) {
        console.error("Error uploading room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
