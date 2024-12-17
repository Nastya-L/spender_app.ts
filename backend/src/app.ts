import express from 'express';
import cors from 'cors';
import type { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import authorizationRouters from './routes/authorizationRouters.js';
import jarRouter from './routes/jarRoutes.js';
import shareJarRouter from './routes/shareJarRoutes.js';
import expenseRouter from './routes/expenseRoutes.js';

const app: Express = express();
dotenv.config();
const {
  PORT,
  DATABASE_NAME,
  DATABASE_URL
} = process.env;
app.use(cors());
app.use(express.json());
app.use('/user/register', userRouter);
app.use('/user/login', authorizationRouters);
app.use('/jar', jarRouter);
app.use('/share', shareJarRouter);
app.use('/', expenseRouter);

const mongoString = DATABASE_URL || '';

mongoose.connect(mongoString, { dbName: DATABASE_NAME })
  .then(() => {
    console.log('Database Connected');
  })
  .catch((error) => {
    console.log(error);
  });

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
