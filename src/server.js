import express from 'express'
import configViewEngine from "./config/viewEngine.js";
import db from './config/connectDb.js';
import  initWebRouter from "./routes/web.js";
import initApiRouter from "./routes/api.js";
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
require('../passport.js')

require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 6969


const corsOptions = {
    origin: 'http://localhost:3000', // Thay đổi địa chỉ này thành nguồn gốc của ứng dụng của bạn
    optionsSuccessStatus: 200, // Mã trạng thái thành công mặc định khi yêu cầu CORS thành công
    credentials: true,
  };
  
  // Sử dụng middleware CORS trên tất cả các yêu cầu
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
configViewEngine(app);
//conect database
db.connect()
// init web router
initWebRouter(app); 
initApiRouter(app); 

app.listen(PORT, () => {
    console.log(" Running on port " + PORT +":  http://localhost:" +PORT);
})