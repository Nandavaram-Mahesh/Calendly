import express, {Express, Request, Response } from 'express'
import { userRouter } from './routes/user.route.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

const app:Express = express()


app.get('/health',(req:Request,res:Response)=>{
    res.json({
        status:'ok!',
        timestamp: new Date().toISOString()
    })
})

app.use('/users',userRouter);

app.use(globalErrorHandler);

export {app};