import express from 'express';
import type { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';

const app: Express = express();
app.use(express.json());
app.use('/user/register', userRouter);

dotenv.config();
const {
  PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DB_NAME
} = process.env;
const dbHost = process.env.MONGODB_HOST || 'localhost';
const mongoString = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${dbHost}:${DATABASE_PORT}/`;

mongoose.connect(mongoString, { dbName: DB_NAME })
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
