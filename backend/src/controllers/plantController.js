import { Plant } from "../models/model.js";
import { uploadToS3, getObjectURL, deleteFromS3 } from "../utils/s3Utils.js";
import fs from "fs";

// UTIL: Generates a signed S3 URL for a Plant image, if available
const withImageUrl = async (plantDoc) => {
  if (!plantDoc || !plantDoc.image || !plantDoc.image.key) return plantDoc;
  const imageUrl = await getObjectURL(plantDoc.image.key);
  return { ...plantDoc.toObject(), image: { ...plantDoc.image, imageUrl } };
};

// Get all plants
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find()
      .populate("categoryId")
      .populate("reviews");

    // Add signed URLs in parallel
    const plantsWithUrls = await Promise.all(
      plants.map(async (plant) => {
        try {
          return await withImageUrl(plant);
        } catch (err) {
          console.error("withImageUrl failed for plant:", plant._id, err);
          return plant; // fallback: return raw plant without image
        }
      })
    );

    res.json(plantsWithUrls);
  } catch (err) {
    console.error("Error in getAllPlants:", err);
    res.status(500).json({ message: "Error fetching plants" });
  }
};

// Get trending plants
const getTrendingPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ isTrending: true }).populate(
      "categoryId"
    );
    const plantsWithUrls = await Promise.all(plants.map(withImageUrl));
    res.json(plantsWithUrls);
  } catch (err) {
    res.status(500).json({ message: "Error fetching trending plants" });
  }
};

// Get bestseller plants
const getBestSellerPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ isBestSeller: true }).populate(
      "categoryId"
    );
    const plantsWithUrls = await Promise.all(plants.map(withImageUrl));
    res.json(plantsWithUrls);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bestsellers" });
  }
};

// Get a single plant by ID
const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid plant ID" });
    }
    const plant = await Plant.findById(id)
      .populate("categoryId")
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
      });

    if (!plant) return res.status(404).json({ message: "Plant not found" });

    res.json(await withImageUrl(plant));
  } catch (err) {
    res.status(500).json({ message: "Error fetching plant" });
  }
};

// Create plant with image upload to S3
const createPlant = async (req, res) => {
  const {
    name,
    description,
    price,
    categoryId,
    discountPercentage,
    isTrending,
    isBestSeller,
  } = req.body;

  console.log("Creating plant with data:", req.body);

  if (!name || !description || !price || !categoryId)
    return res.status(400).json({
      message: "Missing required fields: name, description, price, categoryId",
    });

  if (req.body.sale === "true" || req.body.sale === true) {
    if (!req.body.salePrice) {
      return res
        .status(400)
        .json({ message: "Sale price is required when sale is active" });
    }
  }
  let imageData = null;
  if (req.file) {
    const s3Key = `plants/${Date.now()}_${req.file.originalname}`;
    try {
      await uploadToS3(
        req.file.buffer || fs.readFileSync(req.file.path), // Adapt for Multer storage mode
        s3Key,
        req.file.mimetype
      );
      imageData = {
        key: s3Key,
        contentType: req.file.mimetype,
        imageName: req.file.originalname,
        size: req.file.size,
      };
      try {
        if (req.file.path) fs.unlinkSync(req.file.path);
      } catch (_) {}
    } catch (e) {
      try {
        if (req.file.path) fs.unlinkSync(req.file.path);
      } catch (_) {}
      return res.status(500).json({ message: "Failed to upload image" });
    }
  }

  try {
    const plant = await Plant.create({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: req.body.stock ? parseInt(req.body.stock) : 0, // ✅ new
      categoryId,
      discountPercentage: discountPercentage
        ? parseFloat(discountPercentage)
        : 0,
      sale: req.body.sale === "true" || req.body.sale === true, // ✅ new
      salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null, // ✅ new
      featured: req.body.featured === "true" || req.body.featured === true, // ✅ new
      isTrending: isTrending === "true" || isTrending === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      image: imageData, // imageData already holds key, mimetype, size, (and imageUrl if you set it above)
    });

    res.status(201).json(await withImageUrl(plant));
  } catch (e) {
    console.error("❌ Error creating plant:", e);
    res.status(500).json({ message: "Failed to create plant" });
  }
};

// Update plant (with optional image upload)
const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/))
      return res.status(400).json({ message: "Invalid plant ID" });

    let data = { ...req.body };
    if (data.price) data.price = parseFloat(data.price);
    if (data.discountPercentage)
      data.discountPercentage = parseFloat(data.discountPercentage);

    // If updating image
    if (req.file) {
      const s3Key = `plants/${Date.now()}_${req.file.originalname}`;
      await uploadToS3(
        req.file.buffer || fs.readFileSync(req.file.path),
        s3Key,
        req.file.mimetype
      );
      data.image = {
        key: s3Key,
        contentType: req.file.mimetype,
        imageName: req.file.originalname,
        size: req.file.size,
      };
      try {
        if (req.file.path) fs.unlinkSync(req.file.path);
      } catch (_) {}
    }

    const plant = await Plant.findByIdAndUpdate(id, data, {
      new: true,
    }).populate("categoryId");
    if (!plant) return res.status(404).json({ message: "Plant not found" });

    res.json(await withImageUrl(plant));
  } catch (err) {
    res.status(500).json({ message: "Error updating plant" });
  }
};

// Delete plant (optionally delete image from S3)
const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findByIdAndDelete(id);
    // Optionally delete S3 image
    if (plant && plant.image && plant.image.key) {
      try {
        await deleteFromS3(plant.image.key);
      } catch (e) {}
    }
    res.json({ message: "Plant deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting plant" });
  }
};

// Export controller functions
export default {
  getAllPlants,
  getTrendingPlants,
  getBestSellerPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
};
