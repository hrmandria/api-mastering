import express from "express";
import multer from "multer";
import {
  getFile,
  getUserMasteringList,
  masterize,
} from "../controllers/mastering.controller";
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/get-list", getUserMasteringList);
router.post("/masterize", upload.single("file"), masterize);
router.get("/getMastered", getFile);
export default router;
