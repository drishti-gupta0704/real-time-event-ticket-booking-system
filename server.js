
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const seatRoutes = require("./routes/seatRoutes");
const seatLockRoutes = require("./routes/seatLockRoutes");

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
connectRedis();

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/seats", seatLockRoutes);

app.get("/", (req, res) => {
    res.send("Event Ticket Booking API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});