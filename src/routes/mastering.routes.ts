import express from "express";
import multer from "multer";
import {
  getFile,
  getOneMastering,
  getUserMasteringList,
  masterize,
} from "../controllers/mastering.controller";
const router = express.Router();

const storage = multer.diskStorage({
  destination: "mastered/",
  filename: (req, files, cb) => {
    const filename = files.originalname;
    const index = filename.lastIndexOf(".");
    const result = filename.substring(index);
    cb(null, `${filename.split(".")[0]}-${Date.now()}` + result);
  },
});
const upload = multer({ storage });

router.get("/get-list", getUserMasteringList);
router.get("/get-one", getOneMastering);
router.post("/masterize", upload.single("file"), masterize);
router.get("/getMastered", getFile);
export default router;
