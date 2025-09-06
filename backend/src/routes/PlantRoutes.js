import express from "express";
import plantController from "../controllers/plantController.js";
import multer from "multer";

// Middlewares
import isAdmin from "../middlewares/isAdmin.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Public routes
router.get("/", plantController.getAllPlants);
router.get("/trending", plantController.getTrendingPlants);
router.get("/bestsellers", plantController.getBestSellerPlants);
router.get("/:id", plantController.getPlantById);

// Admin-only routes
router.post("/", upload.single("plant_image"), plantController.createPlant);
router.put("/:id", upload.single("plant_image"), plantController.updatePlant);
router.delete("/:id", plantController.deletePlant);

export default router;
