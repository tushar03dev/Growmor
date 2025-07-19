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