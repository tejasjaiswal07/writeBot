const natural = require('natural');

exports.analyze = async (text) => {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(text);
  const sentences = text.split(/[.!?]+/);

  const readabilityScore = natural.FleschKincaid.grade(text);
  const sentiment = new natural.SentimentAnalyzer().getSentiment(words);

  return {
    wordCount: words.length,
    sentenceCount: sentences.length,
    readabilityScore: readabilityScore,
    sentiment: sentiment,
    // You can add more advanced analysis here
  };
};