const redis = require('redis');

const redisSocketPath = '/home/kisumake/tmp/redis.sock';

// const redisClient = redis.createClient({
//   socket: {
//     path: redisSocketPath
//   }
// });

const redisClient = redis.createClient({
  url: 'redis://localhost:6379'
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Redis connection error:', error);
    process.exit(1);
  }
};

connectRedis();

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

module.exports = redisClient;