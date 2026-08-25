
const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");


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


module.exports = {
    createPaymentOrder
};