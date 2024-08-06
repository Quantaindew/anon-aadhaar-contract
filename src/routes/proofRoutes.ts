import express from 'express';
import { generateProofController } from '../controllers/proofController.js';

const router = express.Router();


router.post('/generate', generateProofController);

export default router;