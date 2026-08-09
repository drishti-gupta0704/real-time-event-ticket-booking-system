
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


const registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }



        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });


        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: generateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });

    }

};


const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });

};

module.exports = {
    registerUser,
    loginUser,
    getProfile
};