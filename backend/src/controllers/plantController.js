import prisma from "../utils/prisma.js";
import { uploadToS3, getObjectURL, deleteFromS3 } from "../utils/s3Utils.js";
import fs from "fs";

// Utility: adds signed image URL to plant record
const withImageUrl = async (plant) => {
  if (!plant || !plant.imageKey) return plant;

  const url = await getObjectURL(plant.imageKey);
  return { ...plant, imageUrl: url };
};

// Get all plants
export const getAllPlants = async (req, res) => {
  try {
    console.log("getAllPlants invoked");

    const plants = await prisma.plant.findMany({
      include: {
        category: true,
        reviews: {
          include: { user: { select: { name: true } } }
        }
      }
    });

    const plantsWithUrls = await Promise.all(
        plants.map(async (p) => {
          try {
            return await withImageUrl(p);
          } catch (err) {
            console.log("withImageUrl failed for plant", p.id, err);
            return p;
          }
        })
    );

    res.json(plantsWithUrls);
  } catch (err) {
    console.log("Error in getAllPlants:", err);
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get trending plants
export const getTrendingPlants = async (req, res) => {
  try {
    console.log("getTrendingPlants invoked");

    const plants = await prisma.plant.findMany({
      where: { isTrending: true },
      include: { category: true }
    });

    const withUrls = await Promise.all(plants.map(withImageUrl));
    res.json(withUrls);
  } catch (err) {
    console.log("Error in getTrendingPlants:", err);
    res.status(500).json({ message: "Error fetching trending plants" });
  }
};

// Get bestseller plants
export const getBestSellerPlants = async (req, res) => {
  try {
    console.log("getBestSellerPlants invoked");

    const plants = await prisma.plant.findMany({
      where: { isBestSeller: true },
      include: { category: true }
    });

    const withUrls = await Promise.all(plants.map(withImageUrl));
    res.json(withUrls);
  } catch (err) {
    console.log("Error in getBestSellerPlants:", err);
    res.status(500).json({ message: "Error fetching best sellers" });
  }
};

// Get plant by ID
export const getPlantById = async (req, res) => {
  try {
    console.log("getPlantById invoked with id:", req.params.id);

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const plant = await prisma.plant.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: { include: { user: { select: { name: true } } } }
      }
    });

    if (!plant) return res.status(404).json({ message: "Plant not found" });

    res.json(await withImageUrl(plant));
  } catch (err) {
    console.log("Error in getPlantById:", err);
    res.status(500).json({ message: "Error fetching plant" });
  }
};

// Create plant
export const createPlant = async (req, res) => {
  try {
    console.log("createPlant invoked");
    console.log("Request body:", req.body);
    console.log("File:", req.file);

    const {
      name,
      description,
      price,
      categoryId,
      discountId,
      sale,
      salePrice,
      featured,
      isTrending,
      isBestSeller,
      stock
    } = req.body;

    if (!name || !description || !price || !categoryId) {
      return res.status(400).json({
        message: "Missing required fields: name, description, price, categoryId"
      });
    }

    let imageKey = null;
    let contentType = null;
    let imageName = null;
    let size = null;

    // Handle S3 upload if a file is provided
    if (req.file) {
      const key = `plants/${Date.now()}_${req.file.originalname}`;

      await uploadToS3(
          req.file.buffer || fs.readFileSync(req.file.path),
          key,
          req.file.mimetype
      );

      imageKey = key;
      contentType = req.file.mimetype;
      imageName = req.file.originalname;
      size = req.file.size;

      // Remove temp file if stored locally
      if (req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (_) {}
      }
    }

    const plant = await prisma.plant.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        stock: stock ? parseInt(stock) : 0,
        categoryId: parseInt(categoryId),
        discountId: discountId ? parseInt(discountId) : null,
        sale: sale === "true" || sale === true,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        featured: featured === "true" || featured === true,
        isTrending: isTrending === "true" || isTrending === true,
        isBestSeller: isBestSeller === "true" || isBestSeller === true,
        imageKey,
        contentType,
        imageName,
        size
      }
    });

    res.status(201).json(await withImageUrl(plant));
  } catch (err) {
    console.log("Error in createPlant:", err);
    res.status(500).json({ message: "Failed to create plant" });
  }
};

// Update plant
export const updatePlant = async (req, res) => {
  try {
    console.log("updatePlant invoked with id:", req.params.id);
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const data = { ...req.body };

    // Convert numeric fields
    if (data.price) data.price = parseFloat(data.price);
    if (data.stock) data.stock = parseInt(data.stock);
    if (data.discountId) data.discountId = parseInt(data.discountId);
    if (data.salePrice) data.salePrice = parseFloat(data.salePrice);
    if (data.categoryId) data.categoryId = parseInt(data.categoryId);

    // Convert boolean fields
    if (data.sale !== undefined)
      data.sale = data.sale === "true" || data.sale === true;

    if (data.featured !== undefined)
      data.featured = data.featured === "true" || data.featured === true;

    if (data.isTrending !== undefined)
      data.isTrending = data.isTrending === "true" || data.isTrending === true;

    if (data.isBestSeller !== undefined)
      data.isBestSeller =
          data.isBestSeller === "true" || data.isBestSeller === true;

    // Handle optional new image upload
    if (req.file) {
      const key = `plants/${Date.now()}_${req.file.originalname}`;

      await uploadToS3(
          req.file.buffer || fs.readFileSync(req.file.path),
          key,
          req.file.mimetype
      );

      data.imageKey = key;
      data.contentType = req.file.mimetype;
      data.imageName = req.file.originalname;
      data.size = req.file.size;

      if (req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (_) {}
      }
    }

    const updated = await prisma.plant.update({
      where: { id },
      data
    });

    res.json(await withImageUrl(updated));
  } catch (err) {
    console.log("Error in updatePlant:", err);
    res.status(500).json({ message: "Error updating plant" });
  }
};

// Delete plant
export const deletePlant = async (req, res) => {
  try {
    console.log("deletePlant invoked with id:", req.params.id);

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }

    const plant = await prisma.plant.delete({
      where: { id }
    });

    // Delete S3 file if present
    if (plant.imageKey) {
      try {
        await deleteFromS3(plant.imageKey);
      } catch (_) {}
    }

    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    console.log("Error in deletePlant:", err);
    res.status(500).json({ message: "Error deleting plant" });
  }
};

// Export all controller functions
export default {
  getAllPlants,
  getTrendingPlants,
  getBestSellerPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
