
const prisma = require('../utils/prismaImport.js');
const asyncHandler = require('../utils/asyncHandler.js');

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

exports.getPlantsByCategory = asyncHandler(async (req, res) => {
  const categoryId = parseInt(req.params.id);
  const plants = await prisma.plant.findMany({
    where: { categoryId },
    include: { images: true }
  });
  res.json(plants);
});


//ADMIN ONLY

exports.createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await prisma.category.create({
    data: { name , description}
  });
  res.status(201).json(category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const category = await prisma.category.update({
    where: { id: parseInt(id) },
    data
  });
  res.json(category);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.category.delete({ where: { id: parseInt(id) } });
  res.json({ message: 'Category deleted' });
});
