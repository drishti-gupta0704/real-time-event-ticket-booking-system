
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/sendEmail");
const { getIO } = require("../config/socket");


const createPaymentOrder = async (req, res) => {

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
                message: "You are not authorized to pay for this booking"
            });
        }


        if (booking.paymentStatus === "paid") {
            return res.status(400).json({
                message: "Booking is already paid"
            });
        }

        const amountInPaise = booking.totalAmount * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: booking._id.toString()
        });

        booking.razorpayOrderId = order.id;
        await booking.save();  


        res.status(200).json({

            success: true,
            message: "Payment order created successfully",

            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }

        });

    } 
    
    catch (error) {

        console.error("Payment order error:", error);
        res.status(500).json({
            message: error.message
        });

    }

};


const verifyPayment = async (req, res) => {

    try {
        const { razorpay_order_id, razorpay_payment_id,razorpay_signature } = req.body;
        
        if ( !razorpay_order_id || !razorpay_payment_id || !razorpay_signature ) 
        
        {
            return res.status(400).json({
                message: "Payment details are required"
            });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                razorpay_order_id + "|" + razorpay_payment_id
            )
            .digest("hex");


        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });

        }

        const booking = await Booking.findOne({
            razorpayOrderId: razorpay_order_id
        });


        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });

        }


        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to verify this payment"
            });

        }




       booking.paymentStatus = "paid";
       booking.status = "confirmed";
       booking.razorpayPaymentId = razorpay_payment_id;

       await booking.save();



       
       const io = getIO();

       io.emit("seatsBooked", {
       eventId: booking.event.toString(),
       seats: booking.seats.map(seatId => ({
       seatId: seatId.toString(),
       status: "booked"
         }))
           });



       populatedBooking = await Booking.findById(booking._id)
       .populate("user", "name email")
       .populate("event", "title venue city date time price")
       .populate("seats", "seatNumber");

       const seatNumbers = populatedBooking.seats
       .map(seat => seat.seatNumber)
       .join(", ");

       await sendEmail(
        populatedBooking.user.email,
        "Booking Confirmed - Ticket Booking System",
       `
        <h2>Booking Confirmed </h2>

        <p>Hello ${populatedBooking.user.name},</p>

        <p>Your booking has been successfully confirmed.</p>

        <h3>Event Details</h3>

        <p><strong>Event:</strong> ${populatedBooking.event.title}</p>
        <p><strong>Venue:</strong> ${populatedBooking.event.venue}</p>
        <p><strong>City:</strong> ${populatedBooking.event.city}</p>
        <p><strong>Date:</strong> ${new Date(populatedBooking.event.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${populatedBooking.event.time}</p>

        <h3>Booking Details</h3>

        <p><strong>Booking ID:</strong> ${populatedBooking._id}</p>
        <p><strong>Seats:</strong> ${seatNumbers}</p>
        <p><strong>Total Amount:</strong> ₹${populatedBooking.totalAmount}</p>
        <p><strong>Payment Status:</strong> Paid</p>

        <p>Thank you for booking with us! </p>
    `
);




        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
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
    createPaymentOrder,
    verifyPayment
};