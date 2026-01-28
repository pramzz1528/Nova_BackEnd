const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function for password validation
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (password.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character';
    return null;
};

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ msg: passwordError });
    }

    try {
        const normalizedEmail = email.toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already taken' });
        }

        // Create new user (password hashing handled by pre-save hook)
        user = new User({
            username,
            email,
            password
        });

        await user.save();

        res.status(201).json({
            msg: 'User registered successfully. Please login.'
        });
    } catch (err) {
        console.error('Registration Error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter both email and password' });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.warn(`[AUTH] Failed login attempt: User not found (${normalizedEmail})`);
            return res.status(400).json({ msg: 'User not found' });
        }

        // Check password using model method
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.warn(`[AUTH] Failed login attempt: Incorrect password for ${normalizedEmail}`);
            return res.status(400).json({ msg: 'Incorrect password' });
        }

        // Auto-Migration: If verifying a legacy plain text password, re-save to trigger hashing
        // matchPassword returns true for legacy plain text too.
        if (!user.password.startsWith('$2')) {
            console.log(`[AUTH] Migrating legacy password for user ${user.email}`);
            user.password = password; // Trigger modification
            await user.save(); // Pre-save hook will hash it
        }

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
        console.error('Login Error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
};

// @route   POST api/auth/onboarding
// @desc    Complete onboarding (profession & personality)
// @access  Private
exports.onboarding = async (req, res) => {
    const { profession, assistantName, personality } = req.body;

    // Optional validation: check if profession is valid
    const validProfessions = ['IT Professional'];
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
        res.status(500).json({ msg: 'Server error during onboarding' });
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
    const { username, name, email, bio, avatarUrl, profession, assistantName, personality, memorySettings } = req.body;
    console.log(`[AUTH] Profile update attempt for user ${req.user.id}`);
    console.log(`[AUTH] Update data:`, { username, name, email });

    try {
        let user = await User.findById(req.user.id);
        if (!user) {
            console.log('[AUTH] User not found during profile update');
            return res.status(404).json({ msg: 'User not found' });
        }

        // Handle Username / Name update (Frontend sends 'name', Backend uses 'username')
        const newUsername = username || name;
        if (newUsername && newUsername !== user.username) {
            console.log(`[AUTH] Checking username availability: ${newUsername}`);
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                console.log('[AUTH] Username already taken');
                return res.status(400).json({ msg: 'Username already taken' });
            }
            user.username = newUsername;
        }

        // Handle Email update
        if (email && email !== user.email) {
            console.log(`[AUTH] Checking email availability: ${email}`);
            const existingEmail = await User.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                console.log('[AUTH] Email already exists');
                return res.status(400).json({ msg: 'Email already exists' });
            }
            user.email = email.toLowerCase();
        }

        if (bio !== undefined) user.bio = bio;
        if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

        if (profession) {
            const validProfessions = ['IT Professional', 'Student', 'HR / Manager', 'Freelancer', 'General User', 'Not Specified'];
            if (!validProfessions.includes(profession)) {
                return res.status(400).json({ msg: 'Invalid profession selection' });
            }
            user.profession = profession;
        }

        if (assistantName) user.assistantName = assistantName;

        if (personality) {
            user.personality = { ...user.personality, ...personality };
        }

        if (memorySettings) {
            user.memorySettings = { ...user.memorySettings, ...memorySettings };
        }

        await user.save();
        console.log(`[AUTH] Profile updated successfully for user ${user.email}`);

        // Return structured user object matching what frontend expects
        res.json({
            id: user.id,
            name: user.username, // Map username to name for frontend
            email: user.email,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
            profession: user.profession,
            assistantName: user.assistantName,
            personality: user.personality,
            onboarded: user.onboarded
        });
    } catch (err) {
        console.error('Update Profile Error:', err.message);
        res.status(500).json({ msg: 'Server error during profile update' });
    }
};

// @route   POST api/auth/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    console.log(`[AUTH] Password change attempt for user ${req.user.id}`);

    if (!currentPassword || !newPassword) {
        console.log('[AUTH] Missing password fields');
        return res.status(400).json({ msg: 'Please provide both current and new passwords' });
    }

    // Password validation
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
        return res.status(400).json({ msg: passwordError });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            console.log('[AUTH] User not found');
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if current password is correct
        const isMatch = await user.matchPassword(currentPassword);

        if (!isMatch) {
            console.log(`[AUTH] Incorrect current password for user ${user.email}`);
            return res.status(400).json({ msg: 'Incorrect current password' });
        }

        // Update password (hashing handled by pre-save hook)
        user.password = newPassword;
        await user.save();

        console.log(`[AUTH] Password updated successfully for user ${user.email}`);

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error('Change Password Error:', err.message);
        res.status(500).json({ msg: 'Server error during password change' });
    }
};
