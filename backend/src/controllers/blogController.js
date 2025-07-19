import {Blog} from "../models/model.js";

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: 'Invalid blog ID' });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Create a new blog
export const createBlog = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  if (!title || !content || !imageUrl) {
    return res.status(400).json({ message: 'Please provide title, content, and imageUrl' });
  }

  try {
    const blog = new Blog({ title, content, imageUrl });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};