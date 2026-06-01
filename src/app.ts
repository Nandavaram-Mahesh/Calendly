import express, {Express, Request, Response } from 'express'

const app:Express = express()


app.get('/health',(req:Request,res:Response)=>{
    res.json({
        status:'ok',
        message:'Health Check Successful'
    })
})


export {app};