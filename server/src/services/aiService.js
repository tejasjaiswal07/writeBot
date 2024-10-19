const OpenAI = require("openai");
const config = require('../config/env');
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

exports.getSuggestions = async (content, topic) => {
  try {
    const prompt = `Based on the following content:\n\n${content}\n\nProvide 3 suggestions for improving or expanding the writing on the topic of ${topic}. Each suggestion should be a short paragraph.`;

    const response = await openai.completions.create({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 300,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.choices[0].text.trim().split('\n\n');
  } catch (error) {
    logger.error('Error in AI suggestions:', error);
    throw new Error('Failed to generate suggestions');
  }
};

exports.analyzeStyle = async (content) => {
  try {
    const prompt = `Analyze the writing style of the following text and provide a brief summary of its characteristics:\n\n${content}`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    logger.error('Error in AI style analysis:', error);
    throw new Error('Failed to analyze writing style');
  }
};

exports.generateOutline = async (topic, length) => {
  try {
    const prompt = `Create a detailed outline for a ${length}-word essay on the topic: "${topic}". Include main sections and subsections.`;

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 250,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    logger.error('Error in AI outline generation:', error);
    throw new Error('Failed to generate outline');
  }
};