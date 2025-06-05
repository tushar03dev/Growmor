const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryController.js');
const authMiddleware = require("../middlewares/authMiddleware.js");
const isAdmin = require("../middlewares/isAdmin.js");

// Category Routes
router.get('/', categoryController.getAllCategories);
router.get('/:id/plants', categoryController.getPlantsByCategory);
router.post('/',  isAdmin, categoryController.createCategory);    
router.put('/:id',  isAdmin, categoryController.updateCategory); 
router.delete('/:id', isAdmin, categoryController.deleteCategory); 

module.exports = router;