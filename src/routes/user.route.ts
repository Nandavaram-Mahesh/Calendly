import {Router} from 'express';
import { findAllUsers as findAllUsersHandler, getUserById as getUserByIdHandler } from '../controllers/user.controller.js';


const userRouter:Router = Router();

userRouter.get('/',findAllUsersHandler);
userRouter.get('/:id',getUserByIdHandler);

export {userRouter};