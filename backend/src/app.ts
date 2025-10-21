import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';
import authRoutes from "./routes/auth.routes";
import fileUpload from './middlewares/multer.middleware';
import { config } from './config';
import path from 'path';
import fs from 'fs'


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

if(!fs.existsSync('images')){
  fs.mkdirSync('images')
}
app.get("/images/:image", (req, res)=>{
  const {image} = req.params;
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.sendFile(path.join(__dirname, '../', 'images', image))
})

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
  })
);

app.use('/api', fileUpload.fields([{name:'mainImage', maxCount:1},{name:'images', maxCount:config.maxUploadFiles}, {name:'movie', maxCount:1}]),  routes);

// error handler
app.use(errorMiddleware);

export default app;
