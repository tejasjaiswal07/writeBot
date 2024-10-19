const OpenAI = require("openai");
const config = require('../config/env');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

exports.generate = async (prompt, context, style, length) => {
  try {
    const response = await openai.completions.create({
      model: "text-davinci-002",
      prompt: `Given the context: "${context}"\n\nGenerate a ${style} text of approximately ${length} words based on the following prompt: "${prompt}"`,
      max_tokens: Math.floor(length * 1.5), // Adjust as needed
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.choices[0].text.trim();
  } catch (error) {
    logger.error('Error in content generation:', error);
    throw new Error('Failed to generate content');
  }
};