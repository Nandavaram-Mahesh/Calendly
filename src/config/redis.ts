import {Redis} from 'ioredis';
// import {Redlock} from 'redlock';


const redis = new Redis({
    host:process.env.REDIS_HOST || 'localhost',
    port: 6379
})


redis.on('connect', () => {console.log("Redis: Connected Successfully")});
redis.on('error', (err) => console.error('❌ Redis error', err));


// const redlock = new Redlock([redis],{
//   retryCount: 3,   // retry 3 times if lock is taken
//   retryDelay: 100, // wait 100ms between retries
// })




export {redis};