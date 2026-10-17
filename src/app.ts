
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";

import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import NotFound from "./app/middleware/NotFound";
import { envVers } from "./app/config/env";

import "./app/config/passport";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: envVers.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  expressSession({
    name: "tourwave.sid",
    secret: envVers.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: envVers.NODE_ENV === "production",
      sameSite:
        envVers.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to TourWave backend",
  });
});

app.use(globalErrorHandler);
app.use(NotFound);

export default app;
