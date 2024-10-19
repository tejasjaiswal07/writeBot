const express = require('express');
const {
  analyzeText,
  generateContent,
  getWritingHistory,
  getWritingById,
  deleteWriting,
  getBotSuggestions,
  analyzeWritingStyle,
  generateOutline
} = require('../controllers/writerBotController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  analyzeTextSchema,
  generateContentSchema,
  botSuggestionsSchema,
  generateOutlineSchema
} = require('../utils/validators');

const router = express.Router();

router.post('/analyze', auth, validate(analyzeTextSchema), analyzeText);
router.post('/generate', auth, validate(generateContentSchema), generateContent);
router.get('/writings', auth, getWritingHistory);
router.get('/writings/:id', auth, getWritingById);
router.delete('/writings/:id', auth, deleteWriting);
router.post('/suggestions', auth, validate(botSuggestionsSchema), getBotSuggestions);
router.get('/style-analysis/:writingId', auth, analyzeWritingStyle);
router.post('/outline', auth, validate(generateOutlineSchema), generateOutline);

module.exports = router;