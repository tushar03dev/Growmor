import {signUp, signIn, adminLogin} from '../controllers/authController.js';
import {Router} from "express";

const router = Router();

// User sign-up
router.post('/signup', (req ,res) => {
    signUp(req, res);
});

router.post('/login', (req, res) => {
    signIn(req, res);
});

router.post('/admin', (req, res) => {
    adminLogin(req, res);
})

export default router;

