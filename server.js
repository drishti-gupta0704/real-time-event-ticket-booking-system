
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const seatRoutes = require("./routes/seatRoutes");
const seatLockRoutes = require("./routes/seatLockRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");

const app = express();



const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});


io.on("connection", (socket) => {

    console.log("Socket connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });

});



connectDB();


app.use(express.json());
connectRedis();

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/seats", seatLockRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/email", emailRoutes);

app.get("/", (req, res) => {
    res.send("Event Ticket Booking API is running");
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});