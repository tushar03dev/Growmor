const prisma = require('../utils/prismaImport.js');
const asyncHandler = require('../utils/asyncHandler');


exports.getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await prisma.blog.findMany();
  res.json(blogs);
});

exports.getBlogById = asyncHandler(async (req, res) => {
  const blogId = parseInt(req.params.id);
  if (isNaN(blogId)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  const blog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.json(blog);
});

exports.createBlog = asyncHandler(async (req, res) => {
  const { title, content,  imageUrl } = req.body;

  // Optionally validate required fields
  if (!title || !content || !imageUrl) {
    return res.status(400).json({ message: 'Please provide title, content, authorId, and imageUrl' });
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      imageUrl,  // Add imageUrl here
    },
  });

  res.status(201).json(blog);
});


exports.updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const blogId = parseInt(id);
  if (isNaN(blogId)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  // Optional: Validate fields in data if needed (e.g., title, content, imageUrl)

  // Check if blog exists before updating
  const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!existingBlog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const updatedBlog = await prisma.blog.update({
    where: { id: blogId },
    data,
  });

  res.json(updatedBlog);
});


exports.deleteBlog = asyncHandler(async (req, res) => {
  const blogId = parseInt(req.params.id);
  if (isNaN(blogId)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }

  const existingBlog = await prisma.blog.findUnique({ where: { id: blogId } });
  if (!existingBlog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  await prisma.blog.delete({ where: { id: blogId } });
  res.json({ message: 'Blog deleted successfully' });
});