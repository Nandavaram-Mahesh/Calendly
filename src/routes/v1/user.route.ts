import { Router} from 'express';
import { fetchAllUsers,fetchUserById,addUser,modifyUser,removeUser } from '../../controllers/index.js';
import { validate } from '../../middlewares/index.js';
import { createUserSchema } from '../../dto/index.js';



const userRouter:Router = Router();

userRouter.get('/',fetchAllUsers);
userRouter.get('/:id',fetchUserById);

userRouter.post('/',validate(createUserSchema),addUser);

// userRouter.patch("/:id",modifyUser);
userRouter.delete("/:id",removeUser);


export {userRouter};