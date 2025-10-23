const jwt = require('jsonwebtoken');
const User = require('../models/User'); 
// The Product Service uses the JWT_SECRET to decode tokens issued by the Auth Service.
// This is the core concept of cross-service authentication in microservices.

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
    let token;

    // 1. Check if the token exists in the headers
    // Format: 'Bearer <TOKEN>'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Get token from header (removes 'Bearer ')
            token = req.headers.authorization.split(' ')[1];

            // 3. Verify token using the shared secret
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // 4. Attach the decoded user ID to the request object (req.user)
            // This ID can be used for logging or authorization checks
            req.user = decoded.id; 

            // Move to the next middleware or route handler
            next();

        } catch (error) {
            // Token verification failed (e.g., expired, incorrect signature)
            console.error('Token verification failed:', error.message);
            res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    // If no token is found in the header
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

// Middleware to check if the authenticated user is an administrator
// In a real-world scenario, this would check user roles/permissions. 
// For this project, we primarily rely on 'protect' to ensure a valid user is present.
// NEW: A functional admin middleware
const admin = async (req, res, next) => {
    // We are assuming 'protect' middleware has already run and attached the user ID to req.user
    if (req.user) {
        try {
            // Find the user in the database by the ID from the token
            const user = await User.findById(req.user);
            
            // Check if user exists and if they are an admin
            if (user && user.isAdmin) {
                next(); // User is an admin, proceed to the next middleware/route handler
            } else {
                res.status(403); // 403 Forbidden
                throw new Error('Not authorized as an admin');
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed or user not found' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no user information' });
    }
};

module.exports = { protect, admin };