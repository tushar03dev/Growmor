const express = require('express');
const router = express.Router();

const reviewController = require("../controllers/reviewController.js")
const authMiddleware = require("../middlewares/authMiddleware.js");


router.post('/plants/:id/reviews', authMiddleware, reviewController.addReview);
router.get('/plants/:id/reviews', reviewController.getReviewsByPlant);
router.delete('/reviews/:id', authMiddleware, reviewController.deleteReview);

module.exports = router;