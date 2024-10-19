const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger'); // Assuming you have a logger utility

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: async (...args) => {
      try {
        const redisClient = await getRedisClient();
        if (!redisClient) {
          logger.error('Redis client is undefined');
          throw new Error('Redis client is not available');
        }
        return redisClient.sendCommand(args);
      } catch (error) {
        logger.error(`Error in rate limiter: ${error.message}`);
        // Fallback to memory store or throw an error based on your preference
        throw error;
      }
    },
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;