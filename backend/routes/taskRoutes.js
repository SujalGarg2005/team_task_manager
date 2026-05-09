const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, project, assignedTo, dueDate, priority } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
        return res.status(404).json({ message: 'Project not found' });
    }

    // Only admin can create tasks in this project
    if (projectExists.admin.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Only project admin can create tasks' });
    }

    const task = new Task({
        title,
        description,
        project,
        assignedTo,
        dueDate,
        priority,
    });

    const createdTask = await task.save();

    await Activity.create({
        user: req.user._id,
        action: 'Created Task',
        details: `Created task "${title}" in project "${projectExists.name}"`,
    });

    const populatedTask = await Task.findById(createdTask._id).populate('assignedTo', 'name email');
    res.status(201).json(populatedTask);
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
        return res.status(404).json({ message: 'Project not found' });
    }

    let query = { project: req.params.projectId };

    // If not admin of the project, only show assigned tasks
    if (project.admin.toString() !== req.user._id.toString()) {
        query.assignedTo = req.user._id;
    }

    const tasks = await Task.find(query)
        .populate('assignedTo', 'name email')
        .populate('project', 'name');
    res.json(tasks);
});

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (task) {
        // Only assigned user or project admin can update status
        const project = await Project.findById(task.project);
        if (
            task.assignedTo.toString() !== req.user._id.toString() &&
            project.admin.toString() !== req.user._id.toString()
        ) {
            return res.status(401).json({ message: 'Not authorized to update this task' });
        }

        const oldStatus = task.status;
        task.status = req.body.status || task.status;
        const updatedTask = await task.save();

        await Activity.create({
            user: req.user._id,
            action: 'Updated Status',
            details: `Updated status of "${task.title}" from "${oldStatus}" to "${task.status}"`,
        });

        res.json(updatedTask);
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
    const tasks = await Task.find({
        $or: [
            { assignedTo: req.user._id },
            { project: { $in: await Project.find({ admin: req.user._id }).distinct('_id') } }
        ]
    }).populate('assignedTo', 'name');

    const tasksPerUser = {};
    tasks.forEach(task => {
        const userName = task.assignedTo?.name || 'Unassigned';
        tasksPerUser[userName] = (tasksPerUser[userName] || 0) + 1;
    });

    const stats = {
        totalTasks: tasks.length,
        todo: tasks.filter(t => t.status === 'To Do').length,
        inProgress: tasks.filter(t => t.status === 'In Progress').length,
        done: tasks.filter(t => t.status === 'Done').length,
        highPriority: tasks.filter(t => t.priority === 'High').length,
        overdue: tasks.filter(t => t.dueDate < new Date() && t.status !== 'Done').length,
        tasksPerUser
    };

    res.json(stats);
});

// @desc    Get user list (for assignment)
// @route   GET /api/tasks/users
// @access  Private
router.get('/users', protect, async (req, res) => {
    const users = await User.find({}).select('name email');
    res.json(users);
});

module.exports = router;
