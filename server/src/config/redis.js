const Redis = require('ioredis');
const logger = require('../utils/logger');
const config = require('./env');

let redisClient;

const connectRedis = async () => {
  try {
    redisClient = new Redis(config.REDIS_URL);
    logger.info('Redis connected successfully beta');
  } catch (error) {
    logger.error('Redis connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectRedis, getRedisClient: () => redisClient };