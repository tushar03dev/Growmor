import express from "express";

import blogController from "../controllers/blogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", blogController.createBlog); // admin only
router.put("/:id", authMiddleware, isAdmin, blogController.updateBlog); // admin only
router.delete("/:id", authMiddleware, isAdmin, blogController.deleteBlog); // admin only

export default router;
