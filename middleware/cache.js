const redisClient = require('../config/redisClient');

const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    if (!redisClient.isReady) {
      return next();
    }

    // Create a unique cache key including filters from headers
    const filters = req.headers.filters ? JSON.parse(req.headers.filters) : {};
    const cacheKey = `${req.originalUrl}-${JSON.stringify(filters)}`;
    
    try {
      const cachedData = await redisClient.get(cacheKey);
      
      if (cachedData) {
        console.log('Cache HIT:', cacheKey);
        return res.status(200).json(JSON.parse(cachedData));
      }
      
      console.log('Cache MISS:', cacheKey);
      res.originalJson = res.json;
      res.json = async (data) => {
        await redisClient.setEx(cacheKey, duration, JSON.stringify(data));
        console.log('Cached data for key:', cacheKey);
        res.originalJson(data);
      };
      
      next();
    } catch (error) {
      console.error('Redis cache error:', error);
      next();
    }
  };
};

module.exports = cacheMiddleware;