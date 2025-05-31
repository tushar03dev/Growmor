const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware.js")
const userController = require("../controllers/userController.js")


router.get('/users/:id', authMiddleware, userController.getUserProfile);
router.put('/users/:id', authMiddleware, userController.updateUserProfile);

module.exports = router;