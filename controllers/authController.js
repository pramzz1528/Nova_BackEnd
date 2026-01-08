const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        user = new User({
            username,
            email,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                onboarded: user.onboarded
            }
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration', error: err.message });
    }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, onboarded: user.onboarded });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login', error: err.message });
    }
};

// @route   POST api/auth/onboarding
// @desc    Complete onboarding (profession & personality)
// @access  Private
exports.onboarding = async (req, res) => {
    const { profession, assistantName, personality } = req.body;

    // Optional validation: check if profession is valid
    const validProfessions = ['IT Professional', 'Student', 'HR / Manager', 'Freelancer', 'General User'];
    if (profession && !validProfessions.includes(profession)) {
        return res.status(400).json({ msg: 'Invalid profession selection' });
    }

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.profession = profession || user.profession;
        user.assistantName = assistantName || user.assistantName;
        if (personality) {
            user.personality = { ...user.personality, ...personality };
        }
        user.onboarded = true;

        // Default skills based on profession
        if (profession === 'IT Professional') {
            user.enabledSkills = ['Task Management', 'Code Assistance', 'Daily Summary'];
        } else if (profession === 'Student') {
            user.enabledSkills = ['Task Management', 'Reminder System', 'Daily Summary'];
        } else {
            user.enabledSkills = ['Task Management', 'Reminder System'];
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Onboarding Error:', err.message);
        res.status(500).json({ msg: 'Server error during onboarding', error: err.message });
    }
};

// @route   GET api/auth/me
// @desc    Get current user
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { username, profession, assistantName, personality, memorySettings } = req.body;

    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // If username is changing, check if unique
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ msg: 'Username already taken' });
            user.username = username;
        }

        if (profession) {
            const validProfessions = ['IT Professional', 'Student', 'HR / Manager', 'Freelancer', 'General User'];
            if (!validProfessions.includes(profession)) {
                return res.status(400).json({ msg: 'Invalid profession selection' });
            }
            user.profession = profession;
        }

        user.assistantName = assistantName || user.assistantName;

        if (personality) {
            user.personality = { ...user.personality, ...personality };
        }

        if (memorySettings) {
            user.memorySettings = { ...user.memorySettings, ...memorySettings };
        }

        await user.save();
        res.json(user);
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ msg: 'Server error during profile update', error: err.message });
    }
};
