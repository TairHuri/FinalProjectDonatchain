import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';
import authRoutes from "./routes/auth.routes";

import fileUpload, { certificateFolder, imageFolder } from './middlewares/multer.middleware';
import { config } from './config';
import path from 'path';
import fs from 'fs'


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

if(!fs.existsSync(imageFolder)){
  fs.mkdirSync(imageFolder)
}
if(!fs.existsSync(certificateFolder)){
  fs.mkdirSync(certificateFolder)
}
app.get("/images/:image", (req, res)=>{
  const {image} = req.params;
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.sendFile(path.join(__dirname, '../', 'images', image))
})
app.get("/certificates/:certificate", (req, res)=>{
  const {certificate} = req.params;
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  res.sendFile(path.join(__dirname, '../', 'certificates', certificate))
})

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
  })
);

// http://localhost:5567/api/ngos
app.use('/api', fileUpload.fields([{name:'logo', maxCount:1},{name:'mainImage', maxCount:1},{name:'certificate', maxCount:1},{name:'images', maxCount:config.maxUploadFiles}, {name:'movie', maxCount:1}]),  routes);

// error handler
app.use(errorMiddleware);

export default app;
