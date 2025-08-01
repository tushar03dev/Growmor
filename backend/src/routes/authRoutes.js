import {signUp, signIn, adminLogin} from '../controllers/authController.js';
import {Router} from "express";

const router = Router();

// User sign-up
router.post('/sign-up', (req ,res) => {
    signUp(req, res);
});

router.post('/sign-in', (req, res) => {
    signIn(req, res);
});

router.post('/admin', (req, res) => {
    adminLogin(req, res);
})

export default router;

