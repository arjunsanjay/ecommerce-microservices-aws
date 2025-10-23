// 1. Load Environment Variables
require('dotenv').config();

// 2. Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

// 3. Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// 4. Database Connection Setup
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log('Order Service MongoDB connection established successfully!');
    } catch (error) {
        console.error('Order Service MongoDB connection FAILED: ', error.message);
        process.exit(1);
    }
};
connectDB();

// 5. Route Integration
app.use('/api/orders', orderRoutes);

// 6. Basic Route
app.get('/', (req, res) => {
    res.send('Order Service API is running...');
});

// 7. Start the Server
const PORT = process.env.PORT || 5002; // Using a new port
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));