const Event = require("../models/Event");

const createEvent = async (req, res) => {

    try {

        const {
            title,
            description,
            venue,
            city,
            date,
            time,
            category,
            price,
            totalSeats
        } = req.body;

        if (
            !title ||
            !description ||
            !venue ||
            !city ||
            !date ||
            !time ||
            !category ||
            price === undefined ||
            totalSeats === undefined
        ) 
        
        {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        if (price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }


        if (totalSeats <= 0) {
            return res.status(400).json({
                message: "Total seats must be greater than 0"
            });
        }


        const event = await Event.create({
            title,
            description,
            venue,
            city,
            date,
            time,
            category,
            price,
            totalSeats,
            availableSeats: totalSeats,
            createdBy: req.user._id
        });


        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } 
    
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


const getAllEvents = async (req, res) => {

    try {

        const events = await Event.find()
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } 
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};


const getEventById = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            event
        });

    } 
    
    catch (error) {
        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById
};