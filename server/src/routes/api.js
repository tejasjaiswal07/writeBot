const express = require('express');
const router = express.Router();

router.post('/analyze', (req, res) => {
  const { text } = req.body;
  // Implement text analysis logic here
  const wordCount = text.split(/\s+/).length;
  const sentenceCount = text.split(/[.!?]+/).length;
  res.json({ wordCount, sentenceCount });
});

module.exports = router;