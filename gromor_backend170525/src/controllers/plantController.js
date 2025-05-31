// controllers/plantController.js
const prisma = require('../utils/prismaImport.js');
const uploadImage = require("../utils/cloudinaryUploader.js"); // ✅ Fixed case - lowercase 'c'
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');

// ✅ Get all plants
exports.getAllPlants = async (req, res) => {
  try {
    const plants = await prisma.plant.findMany({
      include: { category: true, images: true }
    });
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching plants' });
  }
};

// ✅ Get trending plants
exports.getTrendingPlants = async (req, res) => {
  try {
    const plants = await prisma.plant.findMany({
      where: { isTrending: true },
      include: { images: true }
    });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trending plants' });
  }
};

// ✅ Get best seller plants
exports.getBestSellerPlants = async (req, res) => {
  try {
    const plants = await prisma.plant.findMany({
      where: { isBestSeller: true },
      include: { images: true }
    });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bestsellers' });
  }
};

// ✅ Get a single plant by ID
exports.getPlantById = async (req, res) => {
  try {
    const plantId = parseInt(req.params.id);
    if (isNaN(plantId)) {
      return res.status(400).json({ message: 'Invalid plant ID' });
    }

    const plant = await prisma.plant.findUnique({
      where: { id: plantId },
      include: {
        category: true,
        images: true,
        reviews: true
      }
    });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.json(plant);
  } catch (err) {
    console.error("Error fetching plant:", err);
    res.status(500).json({ message: 'Error fetching plant' });
  }
};

// ✅ Create plant with image upload
exports.createPlant = asyncHandler(async (req, res) => {
  const { name, description, price, categoryId, discountPercentage, isTrending, isBestSeller } = req.body;
  
  // ✅ Validate required fields
  if (!name || !description || !price || !categoryId) {
    return res.status(400).json({ 
      message: 'Missing required fields: name, description, price, categoryId' 
    });
  }

  let imageUrl = null;

  // ✅ Handle image upload with proper error handling
  if (req.file) {
    try {
      imageUrl = await uploadImage(req.file.path);
      
      // ✅ Safe file cleanup
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file:', req.file.path);
      }
    } catch (uploadError) {
      // ✅ Clean up file if upload fails
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.warn('Failed to cleanup temp file after upload error:', req.file.path);
      }
      
      console.error('Image upload failed:', uploadError);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  }

  try {
    // ✅ Create plant with proper data types
    const plant = await prisma.plant.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        discountPercentage: discountPercentage ? parseFloat(discountPercentage) : 0,
        isTrending: isTrending === 'true' || isTrending === true, // ✅ Handle string/boolean
        isBestSeller: isBestSeller === 'true' || isBestSeller === true, // ✅ Handle string/boolean
        imageUrl,
        category: { connect: { id: parseInt(categoryId) } }
      },
      include: { // ✅ Return related data
        category: true,
    
      }
    });

    res.status(201).json(plant);
  } catch (dbError) {
    console.error('Database error:', dbError);
    res.status(500).json({ message: 'Failed to create plant' });
  }
});

// ✅ Update plant
exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const plantId = parseInt(id);
    
    if (isNaN(plantId)) {
      return res.status(400).json({ message: 'Invalid plant ID' });
    }

    const data = req.body;
    
    // ✅ Parse numeric fields if they exist
    if (data.price) data.price = parseFloat(data.price);
    if (data.discountPercentage) data.discountPercentage = parseFloat(data.discountPercentage);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);

    const plant = await prisma.plant.update({
      where: { id: plantId },
      data,
      include: {
        category: true,
        images: true
      }
    });

    res.json(plant);
  } catch (err) {
    console.error('Update error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(500).json({ message: 'Error updating plant' });
  }
};

// ✅ Delete plant
exports.deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const plantId = parseInt(id);
    
    if (isNaN(plantId)) {
      return res.status(400).json({ message: 'Invalid plant ID' });
    }

    await prisma.plant.delete({ where: { id: plantId } });
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Plant not found' });
    }
    res.status(500).json({ message: 'Error deleting plant' });
  }
};