
let io;

const initializeSocket = (server) => {

    const { Server } = require("socket.io");

    io = new Server(server, {
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

    return io;
};

const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO
};