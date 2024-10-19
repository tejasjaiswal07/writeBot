const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

exports.set = async (key, value, expirationInSeconds) => {
  try {
    const redis = getRedisClient();
    await redis.set(key, JSON.stringify(value), 'EX', expirationInSeconds);
  } catch (error) {
    logger.error('Cache set error:', error);
  }
};

exports.get = async (key) => {
  try {
    const redis = getRedisClient();
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Cache get error:', error);
    return null;
  }
};

exports.del = async (key) => {
  try {
    const redis = getRedisClient();
    await redis.del(key);
  } catch (error) {
    logger.error('Cache delete error:', error);
  }
};