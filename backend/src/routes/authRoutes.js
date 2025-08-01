import {signUp, signIn, adminLogin, changePassword, passwordReset} from '../controllers/authController.js';
import {Router} from "express";

const router = Router();

// User sign-up
router.post('/signup',signUp);

router.post('/login',signIn);

router.post('/admin',adminLogin);

router.post('/password-reset',passwordReset);

router.post('/change-password',changePassword);

export default router;

