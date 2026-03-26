import { createClient } from 'redis';
import { envVers } from './env';

const redisClient = createClient({
    username:envVers.REDIS.REDIS_USERNAME,
    password:envVers.REDIS.REDIS_PASSWORD,
    socket: {
        host:envVers.REDIS.REDIS_HOST,
        port:Number(envVers.REDIS.REDIS_PORT)  
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis Connected");
    }
}

