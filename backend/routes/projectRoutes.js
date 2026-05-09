const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
router.post('/', protect, async (req, res) => {
    if (req.user.role !== 'Admin') {
        return res.status(401).json({ message: 'Only Admins can create projects' });
    }
    const { name, description } = req.body;

    const project = new Project({
        name,
        description,
        admin: req.user._id,
        members: [req.user._id],
    });

    const createdProject = await project.save();

    await Activity.create({
        user: req.user._id,
        action: 'Created Project',
        details: `Created project "${name}"`,
    });

    res.status(201).json(createdProject);
});

// @desc    Get all projects for a user (where they are admin or member)
// @route   GET /api/projects
// @access  Private
router.get('/', protect, async (req, res) => {
    const projects = await Project.find({
        $or: [{ admin: req.user._id }, { members: req.user._id }],
    }).populate('admin', 'name email').populate('members', 'name email');
    res.json(projects);
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    const project = await Project.findById(req.params.id)
        .populate('admin', 'name email')
        .populate('members', 'name email');

    if (project) {
        res.json(project);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin only)
router.post('/:id/members', protect, async (req, res) => {
    const project = await Project.findById(req.params.id).populate('members', 'name');

    if (project) {
        if (project.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only admin can add members' });
        }

        const { userId } = req.body;
        if (project.members.some(m => m._id.toString() === userId)) {
            return res.status(400).json({ message: 'User already a member' });
        }

        project.members.push(userId);
        await project.save();

        await Activity.create({
            user: req.user._id,
            action: 'Added Member',
            details: `Added a member to project "${project.name}"`,
        });

        const updatedProject = await Project.findById(req.params.id).populate('admin', 'name email').populate('members', 'name email');
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin only)
router.delete('/:id/members/:userId', protect, async (req, res) => {
    const project = await Project.findById(req.params.id);

    if (project) {
        if (project.admin.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only admin can remove members' });
        }

        project.members = project.members.filter(
            (member) => member.toString() !== req.params.userId
        );

        await project.save();

        await Activity.create({
            user: req.user._id,
            action: 'Removed Member',
            details: `Removed a member from project "${project.name}"`,
        });

        const updatedProject = await Project.findById(req.params.id).populate('admin', 'name email').populate('members', 'name email');
        res.json(updatedProject);
    } else {
        res.status(404).json({ message: 'Project not found' });
    }
});

module.exports = router;
