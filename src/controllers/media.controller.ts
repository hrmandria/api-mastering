import {Request,Response} from "express"
import { createReadStream, statSync } from "fs";
import { stat } from "fs/promises";
import { resolve, extname } from "path";
import { promisify } from "util";
import mime from "mime";

export const streamAudio =   async(req:Request,res:Response)=>{

    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Range not found");
    }else{

    const CHUNK_SIZE = 10 ** 6; // 1MB
    // const video = resolve("mastered", "SLANDER.mp3");
    const video = resolve("mastered", req.query.media);
    const mediaSize = statSync(video).size;

    const parts = range.replace("bytes=", "").split("-") ;
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
}

}

