const mongoose = require('mongoose');

// Define the structure for a Product document
const productSchema = mongoose.Schema({
    user: { // Links the product to the Admin user who created it (for tracking)
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // This is a reference, but since the User model is in a different service, 
                     // this is more for documentation and structure than strict Mongoose checks.
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    imageUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
