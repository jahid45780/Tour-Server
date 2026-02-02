
import express, { Request,  Response } from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import NotFound from './app/middleware/NotFound'
import passport from 'passport';
import "./app/config/passport"
import expressSession from 'express-session'
import { envVers } from './app/config/env';

const app = express()
app.use(expressSession({
    secret: envVers.EXPRESS_SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
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


