import {Request, Response} from 'express';
import * as userService from '../services/user.service';

//SIGN-UP
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    try {
      const token = await userService.registerUser(email, password);
      res.status(201).json({ token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};