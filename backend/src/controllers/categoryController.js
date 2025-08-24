import { Category, Plant } from "../models/model.js";

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getPlantsByCategory = async (req, res) => {
  try {
    const { id: categoryId } = req.params;
    const plants = await Plant.find({ category: categoryId }).populate(
      "images"
    );
    res.json(plants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ADMIN ONLY

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  getAllCategories,
  getPlantsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
export default {
  getAllCategories,
  getPlantsByCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
