// const express = require("express");
// const router = express.Router();
// const aiController = require("../controllers/aiController");
// const auth = require("../middleware/auth");

// // @route   POST api/ai/chat
// // @desc    Handle chat interaction with AI
// // @access  Private
// router.post("/chat", auth, aiController.chat);

// // @route   POST api/ai/code-assistant
// // @desc    Handle specialized code assistance
// // @access  Private
// router.post("/code-assistant", auth, aiController.codeAssistant);

// // @route   GET api/ai/history
// // @desc    Get interaction memory
// // @access  Private
// router.get("/history", auth, aiController.getHistory);

// // @route   POST api/ai/code-review
// // @desc    Handle code review
// // @access  Private
// router.post("/code-review", auth, aiController.codeReview);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const ai = require('../controllers/aiController');

// router.post('/chat', ai.chat);
// router.post('/code-review', ai.codeReview);
// router.post('/code-assistant', ai.codeAssistant);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const ai = require("../controllers/aiController");

// router.post("/chat", ai.chat);

// module.exports = router;



const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/chat", aiController.chat);

module.exports = router;
