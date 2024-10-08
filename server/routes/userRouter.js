import Router from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import userController from '../controllers/UserController.js';

const userRouter = new Router();

userRouter.post('/login', userController.login);
userRouter.post('/users', userController.createUser);
userRouter.get('/users/:userId', authMiddleware, userController.getUserData);

export default userRouter;
