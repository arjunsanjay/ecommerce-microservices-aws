// 1. Load Environment Variables from .env file
require('dotenv').config();

// 2. Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- 1. IMPORT CORS
const authRoutes = require('./routes/authRoutes'); // <--- IMPORT NEW ROUTES
const userRoutes = require('./routes/userRoutes'); 

// 3. Initialize Express App
const app = express();
// Middleware to parse JSON bodies in requests
app.use(express.json());
app.use(cors()); // <--- 2. USE CORS MIDDLEWARE

// 4. Database Connection Setup
const connectDB = async () => {
    try {
        // Use the URI loaded from the .env file
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
            process.exit(1); // Exit if no URI is found
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true, // Use the new URL parser
            useUnifiedTopology: true, // Use the new Server Discovery and Monitoring engine
            // Note: useCreateIndex and useFindAndModify are deprecated and removed in Mongoose 6+
        });

        console.log('MongoDB connection established successfully!');
    } catch (error) {
        console.error('MongoDB connection FAILED: ', error.message);
        // Exit process with failure
        process.exit(1);
    }
};

// Execute the database connection function
connectDB();

// 5. Route Integration: All /api/auth traffic goes to our router
app.use('/api/auth', authRoutes); // <--- INTEGRATE ROUTES HERE
app.use('/api/users', userRoutes);

// 6. Basic Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Auth Service API is running...');
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));