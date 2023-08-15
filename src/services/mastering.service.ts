import Aimastering from "aimastering";
import fs from "fs";
import _ from "lodash";
import { MasteringModel } from "../models/mastering.model";
export const findUserMasteringList = async (userId: string) => {
  return await MasteringModel.find({ user: userId });
};

// Call API with promise interface

const callApiDeferred = async function (
  api: any,
  method: (...args: any[]) => void,
  ...apiArgments: any[]
) {
  return new Promise<void>((resolve, reject) => {
    const callback = (error: any, data: any, response: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    };
    const args: any[] = _.flatten([apiArgments, callback]);

    method.apply(api, args);
  });
};

const sleep = async function (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const main = async function (inputLocation, outputLocation) {
  // configure API client
  const client = Aimastering.ApiClient.instance;
  const bearer = client.authentications["bearer"];
  // bearer.apiKey = process.env.AIMASTERING_ACCESS_TOKEN;

  client.timeout = 70000;

  // API key must be 'guest_' + [arbitrary string]
  // Unless the API key is leaked, the data will not be visible to others.
  bearer.apiKey = "guest_7dk1h3uutho3visotfogt8292q8rcgomg16t8g21lpm";

  // create api
  const audioApi = new Aimastering.AudioApi(client);
  const masteringApi = new Aimastering.MasteringApi(client);

  // upload input audio
  console.log("starts");
  const inputAudioData = fs.createReadStream(inputLocation);
  const inputAudio: any = await callApiDeferred(
    audioApi,
    audioApi.createAudio,
    {
      file: inputAudioData,
    }
  );
  console.error(inputAudio);

  // start mastering
  let mastering: any = await callApiDeferred(
    masteringApi,
    masteringApi.createMastering,
    inputAudio.id,
    {
      mode: "default",
    }
  );
  console.error(mastering);

  // wait for the mastering completion
  while (mastering.status === "waiting" || mastering.status === "processing") {
    mastering = await callApiDeferred(
      masteringApi,
      masteringApi.getMastering,
      mastering.id
    );
    console.error(
      "waiting for the mastering completion progression: " +
        (100 * mastering.progression).toFixed() +
        "%"
    );
    await sleep(1000);
  }

  // download output audio
  const outputAudioData = await callApiDeferred(
    audioApi,
    audioApi.downloadAudio,
    mastering.output_audio_id
  );
  fs.writeFileSync(outputLocation, outputAudioData);

  console.error("the output file was written to " + outputLocation);
  return "Success";
};

export const getMasteredFiles = async function (directory, files = []) {
  const tmpFiles: any[] = files || [];
  const fileList = fs.readdirSync(directory);
  let fileContents = null;
  for (const file of fileList) {
    const name = `${directory}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      await getMasteredFiles(name, files);
    } else {
      try {
        // Read the contents of the file
        fileContents = fs.readFileSync(name);
        // Do something with the file contents
        console.log("File contents:", fileContents);
      } catch (error) {
        console.error("Error reading file:", error);
      }
      tmpFiles.push(fileContents);
    }
  }
  if (files == null) {
    return "No mastered files";
  }
  return files[0];
};

export const createMastering = async (name: string, userId: string) => {
  const newMastering = await MasteringModel.create({ name, user: userId });

  return await newMastering.save();
};
