const express = require('express');
const router = express.Router();
const automationController = require('../controllers/automationController');
const auth = require('../middleware/auth');

router.post('/', auth, automationController.createAutomation);
router.get('/', auth, automationController.getAutomations);

module.exports = router;
