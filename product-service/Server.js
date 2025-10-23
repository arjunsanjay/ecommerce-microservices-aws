// 1. Load Environment Variables
require('dotenv').config();

// 2. Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <--- 1. IMPORT CORS
const productRoutes = require('./routes/productRoutes');

// 3. Initialize Express App
const app = express();
app.use(express.json());
app.use(cors()); // <--- 2. USE CORS MIDDLEWARE

// 4. Database Connection Setup
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
            process.exit(1);
        }

        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Product MongoDB connection established successfully!');
    } catch (error) {
        console.error('Product MongoDB connection FAILED: ', error.message);
        process.exit(1);
    }
};

// Execute the database connection function
connectDB();

// 5. Route Integration: All /api/products traffic goes to our router
app.use('/api/products', productRoutes);

// 6. Basic Routes (Placeholder)
app.get('/', (req, res) => {
    res.send('Product Catalog Service API is running...');
});

// 7. Start the Server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Product Catalog Service running on port ${PORT}`));
