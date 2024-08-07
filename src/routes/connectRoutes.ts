import express from 'express';
import { connectController } from '../controllers/connectController.js';

const router = express.Router();


router.post('/', connectController);

export default router;