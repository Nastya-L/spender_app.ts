import express from 'express';
import userValidator from '../validators/userValidator.js';
import { getUser, registerUser, updateUser, deleteUser, updatePassword } from '../controllers/userController.js';
import userProfileValidator from '../validators/userProfileValidator.js';
import userPasswordValidator from '../validators/userPasswordValidator.js';
import getUserFromToken from '../middleware/getUserFromToken.js';

const userRouter = express.Router();

userRouter.get('/', getUser);

userRouter.post('/register', userValidator, registerUser);

userRouter.patch('/profile/:id', getUserFromToken, userProfileValidator, updateUser);

userRouter.patch('/password/:id', getUserFromToken, userPasswordValidator, updatePassword);

userRouter.delete('/delete/:id', getUserFromToken, deleteUser);

export default userRouter;
