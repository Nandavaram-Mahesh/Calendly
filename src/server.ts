import 'dotenv/config'

import {app} from './app.js'
import {connectDatabase,redis,AppConfig } from './config/index.js';


const PORT = AppConfig.get('PORT'); 

async function startServer(){
    await connectDatabase();
    
    // await redis.set('test','hello');
    // const val = await redis.get('test');
    // console.log('redis_val: ',val);

    app.listen(PORT,()=>console.log(`Server is running on PORT:${PORT}`))
}


startServer().catch((err)=>{
    console.log('[SERVER]: Failed to start', err);
    process.exit(1);
});
