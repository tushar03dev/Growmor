import prisma from "../utils/prisma.js";

export const getAllCategories = async (req, res) => {
  try {
    console.log("getAllCategories");
    const categories = await prisma.category.findMany();
    console.log("categories found", categories.length);
    res.json(categories);
  } catch (error) {
    console.log("getAllCategories error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getPlantsByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getPlantsByCategory", id);

    const plants = await prisma.plant.findMany({
      where: { categoryId: Number(id) }
    });

    console.log("plants found", plants.length);
    res.json(plants);
  } catch (error) {
    console.log("getPlantsByCategory error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log("createCategory", { name });

    const category = await prisma.category.create({
      data: { name, description }
    });

    console.log("category created", category.id);
    res.status(201).json(category);
  } catch (error) {
    console.log("createCategory error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log("updateCategory", id, data);

    const category = await prisma.category.update({
      where: { id: Number(id) },
      data
    });

    console.log("category updated", id);
    res.json(category);
  } catch (error) {
    console.log("updateCategory error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("deleteCategory", id);

    await prisma.category.delete({
      where: { id: Number(id) }
    });

    console.log("category deleted", id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.log("deleteCategory error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default {
  getAllCategories,
  getPlantsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
