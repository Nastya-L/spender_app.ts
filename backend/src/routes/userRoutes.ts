import express from 'express';
import userValidator from '../validators/userValidator.js';
import { getUser, registerUser, updateUser, deleteUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post('/', userValidator, registerUser);

userRouter.put('/:id', updateUser);

userRouter.delete('/:id', deleteUser);

export default userRouter;
