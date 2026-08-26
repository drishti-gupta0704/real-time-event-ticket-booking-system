
const Seat = require("./models/Seat");
const { redisClient } = require("./config/redis");
const { getIO } = require("./config/socket");

const checkExpiredLocks = async () => {
    try {
        const lockedSeats = await Seat.find({
            status: "locked"
        });

        for (const seat of lockedSeats) {

            const lockKey = `seat_lock:${seat.event}:${seat._id}`;
            const exists = await redisClient.exists(lockKey);

            if (!exists) {

                seat.status = "available";
                await seat.save();

                console.log(
                    `Seat ${seat.seatNumber} lock expired → available`
                );


                const io = getIO();

                io.emit("seatsUnlocked", {
                    eventId: seat.event.toString(),
                    seats: [
                        {
                            seatId: seat._id.toString(),
                            seatNumber: seat.seatNumber,
                            status: "available"
                        }
                    ]
                });
            }
        }

    }
    
    catch (error) {
        console.error(
            "Error checking expired seat locks:",
            error.message
        );
    }
};

module.exports = checkExpiredLocks;