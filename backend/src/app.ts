import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';
import authRoutes from "./routes/auth.routes";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100
  })
);

app.use('/api', routes);

// error handler
app.use(errorMiddleware);

export default app;
