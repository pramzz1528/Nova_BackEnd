const Task = require('../models/Task');

// @route   GET api/tasks
// @desc    Get all user tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error('Fetch Tasks Error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching tasks', error: err.message });
    }
};

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
exports.createTask = async (req, res) => {
    console.log('[DEBUG] createTask Request:', { body: req.body, user: req.user.id });
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
        return res.status(400).json({ msg: 'Task title is required' });
    }

    try {
        const newTask = new Task({
            user: req.user.id,
            title,
            description,
            priority,
            dueDate
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error('Create Task Error:', err.message);
        res.status(500).json({ msg: 'Server error while creating task', error: err.message });
    }
};

// @route   PUT api/tasks/:id
// @desc    Update a task
// @access  Private
exports.updateTask = async (req, res) => {
    const { title, description, priority, status, dueDate } = req.body;

    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.status = status || task.status;
        task.dueDate = dueDate || task.dueDate;

        await task.save();
        res.json(task);
    } catch (err) {
        console.error('Update Task Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while updating task', error: err.message });
    }
};

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });
        if (task.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await task.deleteOne();
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error('Delete Task Error:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Task not found (Invalid ID)' });
        }
        res.status(500).json({ msg: 'Server error while deleting task', error: err.message });
    }
};
