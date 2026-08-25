
const Booking = require("../models/Booking");
const Seat = require("../models/Seat");
const Event = require("../models/Event");
const { redisClient } = require("../config/redis");
const razorpay = require("../config/razorpay");


const createBooking = async (req, res) => {

    try {
        const { eventId } = req.params;
        const { seatIds } = req.body;
        const userId = req.user._id;

        if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return res.status(400).json({
                message: "seatIds must be a non-empty array"
            });
        }


    
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }


        const seats = await Seat.find({
            _id: { $in: seatIds },
            event: eventId
        });


        if (seats.length !== seatIds.length) {
            return res.status(404).json({
                message: "One or more seats not found"
            });
        }


        const bookedSeats = seats.filter(
            seat => seat.status === "booked"
        );

        if (bookedSeats.length > 0) {
            return res.status(409).json({
                message: "One or more seats are already booked"
            });

        }


    
        for (const seat of seats) {
            const lockKey = `seat_lock:${eventId}:${seat._id}`;
            const lockOwner = await redisClient.get(lockKey);


            
            if (!lockOwner) {
                return res.status(409).json({
                    message: `Seat ${seat.seatNumber} is not locked`
                });

            }


      
            if (lockOwner !== userId.toString()) {
                return res.status(403).json({
                    message: `Seat ${seat.seatNumber} is locked by another user`
                });

            }

        }


       
        const totalAmount = seats.length * event.price;
        const booking = await Booking.create({

            user: userId,
            event: eventId,
            seats: seatIds,
            totalAmount,
            status: "pending",
            paymentStatus: "pending"

        });


       
        await Seat.updateMany(
            {
                _id: { $in: seatIds }
            },

            {
                $set: {
                    status: "booked"
                }
            }
        );


   
        for (const seat of seats) {
            const lockKey = `seat_lock:${eventId}:${seat._id}`;
            await redisClient.del(lockKey);

        }


        await Event.findByIdAndUpdate(
            eventId,
            {
                $inc: {
                    availableSeats: -seatIds.length
                }
            }
        );


        res.status(201).json({

            success: true,
            message: "Booking created successfully",
            booking

        });


    } 
    
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



const getMyBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            user: req.user._id
        })
        .populate("event")
        .sort({ createdAt: -1 });


        res.status(200).json({

            success: true,
            count: bookings.length,
            bookings

        });

    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }

};



const getBookingById = async (req, res) => {

    try {
        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId)
            .populate("event");


        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to view this booking"
            });

        }


        res.status(200).json({
            success: true,
            booking

        });

    }
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }

};

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("event", "title venue city date time price")
            .populate("seats", "seatNumber status")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};



const cancelBooking = async (req, res) => {

    try {

        const { bookingId } = req.params;
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }


        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to cancel this booking"
            });
        }


        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled"
            });
        }


         if ( booking.status !== "confirmed" && booking.status !== "pending") {
               return res.status(400).json({
               message: "Booking cannot be cancelled"
              });
        }

      


        if (booking.paymentStatus === "paid") {
             if (!booking.razorpayPaymentId) {
                return res.status(400).json({
                message: "Payment ID not found, refund cannot be processed"
               });
               }

        const refund = await razorpay.payments.refund(

        booking.razorpayPaymentId,
        {
            amount: booking.totalAmount * 100
        }
        );

        console.log("Refund created:", refund.id);

        booking.paymentStatus = "refunded";
        }




        const event = await Event.findById(booking.event);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        await Seat.updateMany(
            {
                _id: { $in: booking.seats }
            },
            {
                $set: {
                    status: "available"
                }
            }
        );

        await Event.findByIdAndUpdate(
            booking.event,
            {
                $inc: {
                    availableSeats: booking.seats.length
                }
            }
        );

        booking.status = "cancelled";

        await booking.save();


        res.status(200).json({

            success: true,
            message: "Booking cancelled successfully",
            booking

        });


    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }

};



module.exports = {
    createBooking,
    getMyBookings,
    getBookingById,
    getAllBookings,
    cancelBooking
};