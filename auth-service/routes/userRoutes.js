const express = require('express');
const router = express.Router();
const User = require('../models/User');
// We need the middleware to protect these routes
const { protect, admin } = require('../middleware/authMiddleware');

// @route   GET /api/users
// @desc    Get all users by an admin
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); // Find all users, remove password from response
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user by an admin
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            // Add a check to prevent an admin from deleting themselves
            if (req.user.toString() === user._id.toString()) {
                res.status(400);
                throw new Error('Admin cannot delete themselves');
            }
            await user.deleteOne();
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
});


module.exports = router;