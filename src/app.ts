import express, {Express, Request, Response,NextFunction } from 'express'

import apiRouter  from './routes/index.js';
import { globalErrorHandler } from './middlewares/index.js';

const app:Express = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use((req:Request, res:Response, next:NextFunction) => {
  console.log("REQUEST:", req.method, req.originalUrl);
  next();
});


app.get('/health',(req:Request,res:Response)=>{
    res.json({
        status:'ok!',
        timestamp: new Date().toISOString()
    })
})

app.use('/api',apiRouter);

app.use(globalErrorHandler);

export {app};