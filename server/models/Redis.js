const redis = require('redis');

const redisClient = redis.createClient({
    host: 'redis',
    port: 6379, 
  });

redisClient.on('connect', () => {
    console.log('Redis on!');
})

redisClient.on('error', (err) => {
    console.log(err.message);
})

redisClient.on('ready', () => {
    console.log('Redis pronto');
})

redisClient.on('end', () => {
    console.log('Redis off');
})

process.on('SIGINT', () => {
    redisClient.quit();
})

redisClient.connect().then(() => {
    console.log('Redis conectado ao host');
}).catch((err) => {
    console.log(err.message);
})
module.exports = redisClient