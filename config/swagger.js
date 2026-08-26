
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Event Ticket Booking API",
            version: "1.0.0",
            description: "API documentation for Event Ticket Booking System"
        },
        servers: [
            {
                url: "https://real-time-event-ticket-booking-system.onrender.com"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;