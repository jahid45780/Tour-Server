
import express, { Request,  Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import NotFound from './app/middleware/NotFound'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use('/api/v1', router)


app.get("/",(req:Request, res:Response)=>{
      res.status(200).json({
        message:"welcome to tour management backed"
      })
})

app.use(globalErrorHandler)
app.use(NotFound)

export default app;


