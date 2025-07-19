import {Category, Plant} from "../models/model.js";


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getPlantsByCategory = async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const plants = await Plant.find({ category: categoryId }).populate('images');
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};






