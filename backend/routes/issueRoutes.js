const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Report a new issue
// @route   POST /api/issues
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description } = req.body;

    const issue = new Issue({
        user: req.user._id,
        title,
        description,
    });

    const createdIssue = await issue.save();
    res.status(201).json(createdIssue);
});

// @desc    Get all issues (Admin only)
// @route   GET /api/issues
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    const issues = await Issue.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(issues);
});

// @desc    Update issue status
// @route   PUT /api/issues/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const issue = await Issue.findById(req.params.id);

    if (issue) {
        issue.status = req.body.status || issue.status;
        const updatedIssue = await issue.save();
        res.json(updatedIssue);
    } else {
        res.status(404).json({ message: 'Issue not found' });
    }
});

module.exports = router;
