
const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
    {
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        seatNumber: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["available", "locked", "booked"],
            default: "available"
        }
    },

    {
        timestamps: true
    }
);

seatSchema.index(
    
    {
        event: 1,
        seatNumber: 1
    },

    {
        unique: true
    }
);

const Seat = mongoose.model("Seat", seatSchema);
module.exports = Seat;