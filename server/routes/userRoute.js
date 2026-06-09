import express from 'express';
import { register, login, profile, addAddress, getAddress, updateAddress, deleteAddress } from '../controllers/userController.js'
import { requireAuth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', requireAuth, profile);
userRouter.post('/addresses',requireAuth, addAddress);
userRouter.get('/addresses', requireAuth, getAddress);
userRouter.patch('/addresses/:id', requireAuth, updateAddress);
userRouter.delete('/address/:id', requireAuth, deleteAddress)

export default userRouter;
