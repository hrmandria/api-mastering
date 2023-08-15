import { Request, Response } from "express";
import fs from "fs";
import {
  createMastering,
  findUserMasteringList,
} from "../services/mastering.service";
import { linkMastering } from "../services/user.service";

export const getUserMasteringList = async (req: Request, res: Response) => {
  return res.send(await findUserMasteringList("64d7c5af64a9587c84fa35c8"));
};

export const masterize = async (req: any, res: Response) => {
  const userId: string = "64d7c5af64a9587c84fa35c8"; // decode token

  const file = req.file;
  const username = req.body.username;
  const folderName = "mastered/" + username;

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }

  console.log(folderName);
  const outputPath = folderName + "/" + file.originalname;
  try {
    if (file) {
      // const response = await main(req.file.path, outputPath);
      const response = "ok";

      const newMastering = await createMastering(file.originalname, userId);
      const updatedUser = await linkMastering(newMastering, userId);

      return res.json({
        message: "Audio masterisé",
        data: { response, filename: file.originalname, newMastering },
      });
    }
  } catch (error) {
    return error;
  }
};

// const currentFileUrl = import.meta.url;
// const currentFilePath = fileURLToPath(currentFileUrl);
// const absolutePath = join(dirname(currentFilePath), "../..");

export const getFile = async (req, res) => {
  // const filepath = `${absolutePath}/mastered`;
  // const { username, filename } = req.query;
  // res.download(`${filepath}/${username}/${filename}`);
};
