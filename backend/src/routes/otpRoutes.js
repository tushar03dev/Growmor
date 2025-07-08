import express from'express'
import {completeSignUp} from "../controllers/authController.js";

const router = express.Router();

router.post('/verify',completeSignUp);

export default router;