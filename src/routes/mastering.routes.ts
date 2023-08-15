import express from "express";
import { getUserMasteringList } from "../controllers/mastering.controller";
const router = express.Router();

router.get("/get-list", getUserMasteringList);
export default router;
