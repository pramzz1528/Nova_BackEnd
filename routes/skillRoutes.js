const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const auth = require('../middleware/auth');

router.post('/toggle', auth, skillController.toggleSkill);
router.get('/relevant', auth, skillController.getRelevantSkills);

module.exports = router;
