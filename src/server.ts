import {app} from './app.js'
import 'dotenv/config'
import { connectDatabase } from './config/database.js';

const PORT = process.env.PORT || 3000 

async function startServer(){
    await connectDatabase();
    app.listen(PORT,()=>console.log(`Server is running on PORT:${PORT}`))
}


startServer().catch((err)=>{
    console.log('[SERVER]: Failed to start', err);
    process.exit(1);
});
