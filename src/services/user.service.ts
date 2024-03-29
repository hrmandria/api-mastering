import bcrypt from "bcrypt";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { default as User, default as userModel } from "../models/user.model";

export const registerUser = async (
  email: string,
  password: string
): Promise<string> => {
  if (await User.exists({ email }))
    throw new Error("Cet email est déjà utilisé! Veuillez vous connecter");
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  const secret: string = process.env.JWT_SECRET!;
  const token = jwt.sign({ _id: user._id }, secret);
  return token;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid email");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid password");
  }
  const secret: string = process.env.JWT_SECRET!;
  const token = jwt.sign({ _id: user._id }, secret);
  return token;
};

export const authenticateUser = async (req: Request): Promise<Object> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new Error("Access denied. No token provided.");
  }
  try {
    const secret: string = process.env.JWT_SECRET!;
    const text = jwt.verify(token, secret);
    const decoded = JSON.stringify(text);
    const tempUser = JSON.parse(decoded);
    console.log(typeof tempUser);
    const user = await User.findById(tempUser._id);
    if (!user) {
      throw new Error("Access denied. No user found.");
    }
    const returnedValue = {
      user: {
        email: user.email,
      },
      token,
    };
    return returnedValue;
  } catch (error) {
    throw new Error("Access denied. Invalid token.");
  }
};

export const linkMastering = async (masteringId: any, userId: string) => {
  const user = await userModel.findById(userId);
  if (!user) console.log("cannot find user", userId);
  const currentMastering = user?.masterings;

  user?.masterings.push(masteringId);

  return await user?.save();
};
