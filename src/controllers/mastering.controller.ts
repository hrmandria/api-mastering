import { Request, Response } from "express";
import { findUserMasteringList } from "../services/mastering.service";

export const getUserMasteringList = async (req: Request, res: Response) => {
  return res.send(await findUserMasteringList(""));
};
