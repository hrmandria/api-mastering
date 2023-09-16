import { Request, Response } from "express";
import fs from "fs";
import jwt_decode from "jwt-decode";
import userModel from "../models/user.model";
import {
  createMastering,
  findOneMastering,
  findUserMasteringList,
  main,
} from "../services/mastering.service";
import { linkMastering } from "../services/user.service";
import { resolve } from "path";

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

export const getOneMastering = async (req: Request, res: Response) => {
  try {
    let token = req.headers.authorization;
    const { masteringId } = req.query;
    if (!token) {
      return res.status(403).send("Veuillez envoyer votre token");
    }
    if (!masteringId) {
      return res.status(403).send("Veuillez envoyer masteringId");
    }
    if (token.includes("Bearer")) {
      token = token.split(" ")[1];
    }

    const decoded: { _id: string } = jwt_decode(token);
    const userId: string = decoded._id;
    return res.send(await findOneMastering(masteringId));
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
  const folderName = "mastered/";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }

  const outputPath = folderName + "/" + `mastered-${file.filename}`;
  try {
    if (file) {
      const response = await main(req.file.path, outputPath);
      console.log("file", file);
      const newMastering = await createMastering(
        `mastered-${file.filename}`,
        file.filename,
        userId
      );
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
  const filepath = resolve(`mastered`);
  console.log("filepath: ", filepath);
  // const filepath = `${absolutePath}/mastered`;
  const { username, filename } = req.query;
  res.download(`${filepath}/${filename}`);
};
