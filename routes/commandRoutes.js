const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');
const auth = require('../middleware/auth');

router.post('/', auth, commandController.createCommand);
router.get('/', auth, commandController.getCommands);
router.put('/:id', auth, commandController.updateCommand);
router.delete('/:id', auth, commandController.deleteCommand);

module.exports = router;
