import cookieParser from "cookie-parser";
import express from "express";
import messageRouter from './routes/message.route.js'
import cors from "cors";
  
const app = express();
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use('/api/v1/message',messageRouter) 

export default app;

// import dotenv from "dotenv";
// dotenv.config({ path: "./config/config.env" });
// console.log(process.env.DB_NAME);