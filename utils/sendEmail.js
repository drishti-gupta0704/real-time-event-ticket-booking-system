
const transporter = require("../config/email");

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });

        console.log("Email sent successfully to:", to);

    } 
    
    catch (error) {

        console.error("Email sending failed:", error.message);
        throw error;
    }
};

module.exports = sendEmail;