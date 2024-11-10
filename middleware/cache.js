const redisClient = require('../config/redisClient');

const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
      if (!redisClient.isReady) {
        console.log('\n\n\tRedis not ready, skipping cache\n\n');
        return next();
      }
  
      const key = req.originalUrl;
      try {
        const cachedData = await redisClient.get(key);
        
        if (cachedData) {
          console.log('\n\n\tCache HIT:', key, '\n\n');
          return res.status(200).json(JSON.parse(cachedData));
        }
        
        console.log('\n\n\tCache MISS:', key, '\n\n');
        res.originalJson = res.json;
        res.json = async (data) => {
          await redisClient.setEx(key, duration, JSON.stringify(data));
          console.log('\n\n\tCached data for key:', key, '\n\n');
          res.originalJson(data);
        };
        
        next();
      } catch (error) {
        console.error('\n\n\tRedis cache error:', error, '\n\n');
        next();
      }
    };
  };

module.exports = cacheMiddleware;