import express from 'express'
import configViewEngine from "./config/viewEngine.js";
import db from './config/connectDb.js';
import  initWebRouter from "./routes/web.js";
import initApiRouter from "./routes/api.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { setupWebSocket } from "./socket/socketConfig.js";
import scheduler from './scheduler.js'; 

require('../passport.js')

require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 6969
const server = require('http').createServer(app);


setupWebSocket(server);
const corsOptions = {
    origin: 'http://localhost:3000', 
    optionsSuccessStatus: 200, 
    credentials: true,
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
configViewEngine(app);
//conect database
db.connect()
scheduler.startScheduler(); // Khởi tạo scheduler

// init web router
initWebRouter(app); 
initApiRouter(app); 

server.listen(PORT, () => {
    console.log(" Running on port " + PORT +":  http://localhost:" +PORT);
})