
const sendEmail = require("../utils/sendEmail");

const testEmail = async (req, res) => {
    try {

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        await sendEmail(
            email,
            "Test Email - Ticket Booking System",
            `
                <h2>Email Test Successful </h2>
                <p>This email was sent from your Node.js backend.</p>
                <p>Nodemailer is working correctly.</p>
            `
        );

        res.status(200).json({
            success: true,
            message: "Test email sent successfully"
        });

    } 
    
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    testEmail
};