const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For token generation

// 1. Define the Schema (Structure of the document)
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users share the same email
    },
    password: {
        type: String,
        required: true,
    },
    // Add this new field
    isAdmin: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// 2. MIDDLEWARE: Hash password before saving (Pre-save Hook)
// This runs whenever a .save() operation is called on a user document
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        next();
    }

    // Generate a salt (random string) to mix with the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    // Continue the save process
});

// 3. METHOD: Check if the entered password matches the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Compares the plain text entered password with the hashed password in the DB
    return await bcrypt.compare(enteredPassword, this.password);
};

// 4. METHOD: Generate the JSON Web Token (JWT)
// This token is what the user uses to prove their identity later
userSchema.methods.generateAuthToken = function () {
    // Signs the token using the user's ID and the secret key from the .env file
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will expire in 30 days
    });
};

// 5. Create and export the Model
const User = mongoose.model('User', userSchema);

module.exports = User;
