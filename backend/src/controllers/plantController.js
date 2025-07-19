import Plant from '../models/model.js';
import {getObjectURL} from '../utils/s3Utils.js';

// UTIL: Generates a signed S3 URL for a Plant image, if available
const withImageUrl = async (plantDoc) => {
  if (!plantDoc || !plantDoc.image || !plantDoc.image.key) return plantDoc;
  const imageUrl = await getObjectURL(plantDoc.image.key);
  return { ...plantDoc.toObject(), image: { ...plantDoc.image, imageUrl } };
};

// Get all plants
export const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find()
        .populate('categoryId')
        .populate('reviews');

    // Add signed URLs in parallel
    const plantsWithUrls = await Promise.all(plants.map(withImageUrl));
    res.json(plantsWithUrls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching plants' });
  }
};

// Get trending plants
export const getTrendingPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ isTrending: true })
        .populate('categoryId');
    const plantsWithUrls = await Promise.all(plants.map(withImageUrl));
    res.json(plantsWithUrls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trending plants' });
  }
};

// Get bestseller plants
export const getBestSellerPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ isBestSeller: true })
        .populate('categoryId');
    const plantsWithUrls = await Promise.all(plants.map(withImageUrl));
    res.json(plantsWithUrls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bestsellers' });
  }
};

// Get a single plant by ID
export const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid plant ID' });
    }
    const plant = await Plant.findById(id)
        .populate('categoryId')
        .populate({ path: 'reviews', populate: { path: 'user', select: 'name' } });

    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    res.json(await withImageUrl(plant));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching plant' });
  }
};

