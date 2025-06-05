const express = require('express');
const router = express.Router();


const plantController = require("../controllers/plantController.js");


//Middlwares
const isAdmin = require("../middlewares/isAdmin.js");
const uploadMiddleware = require("../middlewares/upload.js");
const authMiddleware = require("../middlewares/authMiddleware.js")



// Public routes
router.get('/', plantController.getAllPlants);
router.get('/trending', plantController.getTrendingPlants);
router.get('/bestsellers', plantController.getBestSellerPlants);
router.get('/:id', plantController.getPlantById);

// Admin-only routes
router.post('/',authMiddleware, isAdmin, uploadMiddleware, plantController.createPlant);
router.put('/:id',authMiddleware,  isAdmin, uploadMiddleware, plantController.updatePlant);
router.delete('/:id', authMiddleware, isAdmin, plantController.deletePlant);
// router.patch('/:id/trending',  isAdmin, plantController.setTrendingStatus);
// router.patch('/:id/bestseller', isAdmin, plantController.setBestSellerStatus);

module.exports = router;
