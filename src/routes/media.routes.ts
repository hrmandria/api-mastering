import express from 'express';
import {streamAudio} from '../controllers/media.controller';
const router = express.Router();
router.get('/audio',streamAudio);

export default router;
