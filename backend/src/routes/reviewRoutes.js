import express from "express";

import reviewController from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/plants/:id/reviews", authMiddleware, reviewController.addReview);
router.get("/plants/:id/reviews", reviewController.getReviewsByPlant);
router.delete("/reviews/:id", authMiddleware, reviewController.deleteReview);

export default router;
