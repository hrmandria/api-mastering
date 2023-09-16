import { Request, Response } from "express";
import { createReadStream, statSync } from "fs";
import { resolve } from "path";
import mime from "mime";
import userModel from "../models/user.model";
import jwt_decode from "jwt-decode";

export const streamAudio = async (req: Request, res: Response) => {
  let userToken: string | undefined = req.query.userToken;

  if (!userToken) {
    return res.status(403).send("Veuillez envoyer votre token");
  }
  if (userToken.includes("Bearer")) {
    userToken = userToken.split(" ")[1];
  }
  const decoded: { _id: string } = jwt_decode(userToken);

  const userId: string = decoded._id;

  const user = await userModel.findById(userId);

  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Range not found");
  } else {
    const CHUNK_SIZE = 10 ** 6; // 1MB
    try {
      const video = resolve(`mastered`, req.query.media);
      const mediaSize = statSync(video).size;

      const parts = range.replace("bytes=", "").split("-");
      const start = parseInt(parts[0], 10);
      const end = Math.min(start + CHUNK_SIZE, mediaSize - 1);

      const mimeType = mime.getType(video);

      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${mediaSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": mimeType,
      };

      res.writeHead(206, headers);
      const streamFile = createReadStream(video, { start, end });
      streamFile.pipe(res);
    } catch (err) {
      console.log("Error streaming audio", err);
      res.status(500).send(err);
    }
  }
};
