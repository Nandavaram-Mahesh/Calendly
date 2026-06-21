import { Router} from 'express';
import { findAllUsers , getUserById  , createUser ,updateUser,deleteUser } from '../../controllers/user.controller.js';



const userRouter:Router = Router();

userRouter.get('/',findAllUsers);
userRouter.get('/:id',getUserById);

userRouter.post('/',createUser);

// userRouter.patch("/:id",updateUser);
userRouter.delete("/:id",deleteUser);


export {userRouter};