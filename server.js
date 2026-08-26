
const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const { initializeSocket } = require("./config/socket");

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");



const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const seatRoutes = require("./routes/seatRoutes");
const seatLockRoutes = require("./routes/seatLockRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const emailRoutes = require("./routes/emailRoutes");
const checkExpiredLocks = require("./seatLockExpiry");


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



connectRedis();
setInterval(checkExpiredLocks, 10000);

const server = http.createServer(app);
initializeSocket(server);

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

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});