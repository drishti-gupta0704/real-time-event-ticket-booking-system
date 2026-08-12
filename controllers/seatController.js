
const Seat = require("../models/Seat");
const Event = require("../models/Event");

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




module.exports = {
    generateSeats,
    getEventSeats
};