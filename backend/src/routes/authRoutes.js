const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authController = require("../controllers/authController.js");

//Middlewares
const authMiddleware = require("../middlewares/authMiddleware.js");
const isAdmin = require('../middlewares/isAdmin.js');

//admin
router.post('/admin/signup', authController.adminSignup);
router.post('/admin/login',authController.adminLogin);

//users
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);


router.get('/me', authMiddleware, authController.getCurrentUser);

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: 'http://localhost:5173/login'
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, isAdmin: req.user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/auth/google/callback?token=${token}`);
  }
);

module.exports = router;