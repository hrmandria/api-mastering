import { Request, Response } from "express";
import fs from "fs";
import jwt_decode from "jwt-decode";
import userModel from "../models/user.model";
import {
  createMastering,
  findUserMasteringList,
  main,
} from "../services/mastering.service";
import { linkMastering } from "../services/user.service";

export const getUserMasteringList = async (req: Request, res: Response) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(403).send("Veuillez envoyer votre token");
    }
    if (token.includes("Bearer")) {
      token = token.split(" ")[1];
    }
    console.log("token", token);
    const decoded: { _id: string } = jwt_decode(token);
    const userId: string = decoded._id;
    return res.send(await findUserMasteringList(userId));
  } catch (err) {
    console.log("Error", err);
    return res
      .status(500)
      .send(
        "Une erreur s'est produite pendant la recuperation de la liste de vos masterings"
      );
  }
};

export const masterize = async (req: any, res: Response) => {
  let token: string = req.headers.authorization;
  if (!token) {
    return res.status(403).send("Veuillez envoyer votre token");
  }
  if (token.includes("Bearer")) {
    token = token.split(" ")[1];
  }
  const decoded: { _id: string } = jwt_decode(token);
  const userId: string = decoded._id;

  const user = await userModel.findById(userId);
  if (!user)
    return res
      .send(403)
      .send("Vous devez etre connectez pour cette fonctionnalite");

  const file = req.file;
  const user_email = user.email;
  const folderName = "mastered/" + user_email;

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }

  const outputPath = folderName + "/" + file.originalname;
  try {
    if (file) {
      const response = await main(req.file.path, outputPath);

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
