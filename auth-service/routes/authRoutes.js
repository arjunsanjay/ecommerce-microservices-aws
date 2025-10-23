const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import our User Model

// @route   POST /api/auth/register
// @desc    Register a new user and return a token
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        // 2. Create a new user (the pre-save hook in the model handles hashing the password)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 3. Respond with user details and a generated JWT
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.generateAuthToken(), // Use the method we defined in the model
            });
        }
    } catch (error) {
        // Handle any Mongoose or unexpected errors
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate a user and get a token
// @access  Public
// The CORRECT code
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // 1. Find the user by email
    const user = await User.findOne({ email });

    // 2. Check if user exists AND if the password matches the hashed one
    if (user && (await user.matchPassword(password))) {
        // Password matched! Return the token and user data
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin, // <--- ADD THIS LINE
            token: user.generateAuthToken(),
        });
    } else {
        // Authentication failed
        res.status(401).json({ message: 'Invalid email or password' });
    }
});


module.exports = router;
