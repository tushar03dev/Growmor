import express from "express";

import categoryController from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = express.Router();

// Category Routes
router.get("/", categoryController.getAllCategories);
router.get("/:id/plants", categoryController.getPlantsByCategory);
router.post("/", categoryController.createCategory);
router.put("/:id", isAdmin, categoryController.updateCategory);
router.delete("/:id", isAdmin, categoryController.deleteCategory);

export default router;
