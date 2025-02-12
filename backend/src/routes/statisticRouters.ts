import express from 'express';
import getUserFromToken from '../middleware/getUserFromToken.js';
import { getStatistic } from '../controllers/statisticController.js';

const statisticRouter = express.Router();

statisticRouter.use(getUserFromToken);

statisticRouter.get('/statistic/:id', getStatistic);

export default statisticRouter;
