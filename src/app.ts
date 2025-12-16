
import express, { Request,  Response } from 'express'

const app = express()

app.get("/",(req:Request, res:Response)=>{
      res.send(200).json({
        message:"welcome to tour management backed"
      })
})

export default app;


