import express from 'express';
import getUserFromToken from '../middleware/getUserFromToken.js';
import { deleteShareJar, shareJar } from '../controllers/shareJarController.js';

const shareJarRouter = express.Router();

shareJarRouter.use(getUserFromToken);

shareJarRouter.post('/:id', shareJar);

shareJarRouter.delete('/:idjar/user/:iduser', deleteShareJar);

export default shareJarRouter;
