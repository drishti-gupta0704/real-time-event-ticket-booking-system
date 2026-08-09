const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Event title is required"],
            trim: true
        },

        description: {
            type: String,
            required: [true, "Event description is required"],
            trim: true
        },

        venue: {
            type: String,
            required: [true, "Venue is required"],
            trim: true
        },

        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },

        date: {
            type: Date,
            required: [true, "Event date is required"]
        },

        time: {
            type: String,
            required: [true, "Event time is required"]
        },

        category: {
            type: String,
            required: [true, "Event category is required"],
            trim: true
        },

        price: {
            type: Number,
            required: [true, "Ticket price is required"],
            min: 0
        },

        totalSeats: {
            type: Number,
            required: [true, "Total seats are required"],
            min: 1
        },

        availableSeats: {
            type: Number,
            required: [true, "Available seats are required"],
            min: 0
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;