import express, {Express, Request, Response,NextFunction } from 'express'
import { userRouter } from './routes/index.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

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

app.use('/users',userRouter);

app.use(globalErrorHandler);

export {app};