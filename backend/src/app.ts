import express from 'express';
import mongoose from 'mongoose';
import type { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

const app: Express = express();
dotenv.config();
const {
  PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_PORT
} = process.env;
const dbHost = process.env.MONGODB_HOST || 'localhost';
const mongoString = `mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${dbHost}:${DATABASE_PORT}/`;

mongoose.connect(mongoString)
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
