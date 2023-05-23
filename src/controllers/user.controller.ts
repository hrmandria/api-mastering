import { Request, Response } from 'express';
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

//LOGIN BY EMAIL AND PASSWORD
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const token = await userService.loginUser(email, password);
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//LOGIN BY TOKEN
export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const value = await userService.authenticateUser(req);
    res.status(200).json({ value });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};