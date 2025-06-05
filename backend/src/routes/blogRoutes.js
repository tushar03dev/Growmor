const express = require('express');
const router = express.Router();

const blogController = require("../controllers/blogController.js")
const authMiddleware = require("../middlewares/authMiddleware.js")
const isAdmin = require("../middlewares/isAdmin.js")

router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.post('/blogs', authMiddleware, isAdmin, blogController.createBlog);           // admin only
router.put('/blogs/:id', authMiddleware, isAdmin, blogController.updateBlog);        // admin only
router.delete('/blogs/:id', authMiddleware, isAdmin, blogController.deleteBlog);     // admin only



module.exports = router;