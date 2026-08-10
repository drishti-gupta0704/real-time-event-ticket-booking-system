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



const searchEvents = async (req, res) => {

    try {

        const { name } = req.query;
        if (!name) {
            return res.status(400).json({
                message: "Search name is required"
            });
        }

        const events = await Event.find({
            title: {
                $regex: name,
                $options: "i"
            }
        }).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            events
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};



const updateEvent = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

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


    
        if (title !== undefined) event.title = title;
        if (description !== undefined) event.description = description;
        if (venue !== undefined) event.venue = venue;
        if (city !== undefined) event.city = city;
        if (date !== undefined) event.date = date;
        if (time !== undefined) event.time = time;
        if (category !== undefined) event.category = category;
        if (price !== undefined) event.price = price;

        if (totalSeats !== undefined) {

            if (totalSeats <= 0) {
                return res.status(400).json({
                    message: "Total seats must be greater than 0"
                });
            }

            const bookedSeats =
                event.totalSeats - event.availableSeats;

            if (totalSeats < bookedSeats) {
                return res.status(400).json({
                    message: "Total seats cannot be less than booked seats"
                });
            }

            event.totalSeats = totalSeats;
            event.availableSeats = totalSeats - bookedSeats;
        }


        if (event.price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }


        await event.save();


        res.status(200).json({
            success: true,
            message: "Event updated successfully",
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
    getEventById,
    searchEvents,
    updateEvent
};