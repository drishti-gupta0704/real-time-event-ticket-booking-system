
const crypto = require("crypto");
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