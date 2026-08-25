
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        seats: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Seat",
                required: true
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", ],
            default: "pending"
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending"
        },

        razorpayOrderId: {
           type: String
        },

        razorpayPaymentId: {
           type: String
        },


    },
    
    {
        timestamps: true
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;