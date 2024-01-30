import express from 'express';
import type { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';

const app: Express = express();
dotenv.config();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
