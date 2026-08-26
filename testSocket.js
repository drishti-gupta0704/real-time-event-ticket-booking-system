
const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
    console.log("Connected to Socket.IO:", socket.id);
});

socket.on("seatsLocked", (data) => {
    console.log("Seats locked event received:");
    console.log(data);
});

socket.on("seatsBooked", (data) => {
    console.log("Seats booked event received:");
    console.log(data);
});

socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO");
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});

socket.on("seatsUnlocked", (data) => {
    console.log("Seats unlocked event received:");
    console.log(data);
});