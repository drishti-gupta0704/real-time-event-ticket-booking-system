
const Seat = require("../models/Seat");
const Event = require("../models/Event");
const { redisClient } = require("../config/redis");
const { getIO } = require("../config/socket");

const generateSeats = async (req, res) => {

    try {
        const { eventId } = req.params;
        const { rows, seatsPerRow } = req.body;


        if (!rows || !seatsPerRow) {
            return res.status(400).json({
                message: "Rows and seatsPerRow are required"
            });
        }


        if (rows <= 0 || seatsPerRow <= 0) {
            return res.status(400).json({
                message: "Rows and seatsPerRow must be greater than 0"
            });
        }


        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const existingSeats = await Seat.countDocuments({
            event: eventId
        });


        if (existingSeats > 0) {
            return res.status(400).json({
                message: "Seats have already been generated for this event"
            });
        }


        const seats = [];
        for (let i = 0; i < rows; i++) {
            const rowLetter = String.fromCharCode(65 + i);
            for (let j = 1; j <= seatsPerRow; j++) {
                seats.push({
                    event: eventId,
                    seatNumber: `${rowLetter}${j}`,
                    status: "available"
                });

            }
        }


        const totalGeneratedSeats = seats.length;

        if (totalGeneratedSeats !== event.totalSeats) {
            return res.status(400).json({
                message: `Seat layout generates ${totalGeneratedSeats} seats, but event has ${event.totalSeats} total seats`
            });
        }


    
        const createdSeats = await Seat.insertMany(seats);
        res.status(201).json({
            success: true,
            message: "Seats generated successfully",
            count: createdSeats.length,
            seats: createdSeats
        });

    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};



const getEventSeats = async (req, res) => {

    try {

        const { eventId } = req.params;
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        const seats = await Seat.find({
            event: eventId
        }).sort({
            seatNumber: 1
        });


        res.status(200).json({
            success: true,
            count: seats.length,
            seats
        });

    } 
    
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};


const getSeatById = async (req, res) => {

    try {

        const { seatId } = req.params;
        const seat = await Seat.findById(seatId);

        if (!seat) {
            return res.status(404).json({
                message: "Seat not found"
            });
        }


        res.status(200).json({
            success: true,
            seat
        });

    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};



const lockSeats = async (req, res) => {

    try {
        const { eventId } = req.params;
        const { seatIds } = req.body;

        // Validating input
        if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return res.status(400).json({
                message: "seatIds must be a non-empty array"
            });
        }


        // Finding seats in MongoDB
        const seats = await Seat.find({
            _id: { $in: seatIds },
            event: eventId
        });


        // Check all seats exist
        if (seats.length !== seatIds.length) {
            return res.status(404).json({
                message: "One or more seats not found"
            });
        }


        // Check MongoDB status
        const alreadyBooked = seats.filter(
            seat => seat.status === "booked"
        );

        if (alreadyBooked.length > 0) {
            return res.status(400).json({
                message: "One or more seats are already booked"
            });
        }


        // Check Redis locks
        for (const seat of seats) {

            const lockKey = `seat_lock:${eventId}:${seat._id}`;
            const existingLock = await redisClient.get(lockKey);

            if (existingLock) {
                return res.status(409).json({
                    message: `Seat ${seat.seatNumber} is currently locked`
                });
            }
        }


        // Create Redis locks
        // for (const seat of seats) {

        //     const lockKey = `seat_lock:${eventId}:${seat._id}`;

        //     await redisClient.set(
        //         lockKey,
        //         req.user._id.toString(),
        //         {
        //             EX: 300
        //         }
        //     );
        // }

     // Create Redis locks
       for (const seat of seats) {
       const lockKey = `seat_lock:${eventId}:${seat._id}`;

       await redisClient.set(
        lockKey,
        req.user._id.toString(),
        {
            EX: 300
        }
      );

       seat.status = "locked";
       await seat.save();
    }


    

        const io = getIO();
        io.emit("seatsLocked", {
        eventId,
        seats: seats.map(seat => ({
        seatId: seat._id,
        seatNumber: seat.seatNumber,
        status: "locked"
             }))
                 });




        res.status(200).json({
            success: true,
            message: "Seats locked successfully",
            expiresIn: 300,
            seats: seats.map(seat => ({
                seatId: seat._id,
                seatNumber: seat.seatNumber,
                status: "locked"
            }))
        });

    } 
    
    
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};






module.exports = {
    generateSeats,
    getEventSeats,
    getSeatById,
    lockSeats
};