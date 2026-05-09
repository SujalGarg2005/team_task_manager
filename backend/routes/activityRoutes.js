const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Private
router.get('/', protect, async (req, res) => {
    const activities = await Activity.find({})
        .sort({ createdAt: -1 })
        .limit(20)
        .populate('user', 'name');
    res.json(activities);
});

module.exports = router;
