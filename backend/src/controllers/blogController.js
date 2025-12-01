import {Request, Response} from "express";
import prisma from "../utils/prisma.js";

export const getAllBlogs = async (req: Request, res: Response) => {
    try {
        console.log("getAllBlogs: fetching blogs");
        const blogs = await prisma.blog.findMany();
        console.log("getAllBlogs: fetched", blogs.length);
        return res.status(200).json(blogs);
    } catch (error: any) {
        console.error("getAllBlogs error:", error.message);
        return res.status(500).json({message: "Server Error"});
    }
};

export const getBlogById = async (req: Request, res: Response) => {
    const {id} = req.params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
        console.log("getBlogById: invalid id", id);
        return res.status(400).json({message: "Invalid blog ID"});
    }

    try {
        console.log("getBlogById: fetching blog", blogId);
        const blog = await prisma.blog.findUnique({where: {id: blogId}});
        if (!blog) {
            console.log("getBlogById: not found", blogId);
            return res.status(404).json({message: "Blog not found"});
        }
        console.log("getBlogById: found", blogId);
        return res.status(200).json(blog);
    } catch (error: any) {
        console.error("getBlogById error:", error.message);
        return res.status(500).json({message: "Server Error"});
    }
};

export const createBlog = async (req: Request, res: Response) => {
    const {title, content, imageUrl} = req.body;

    if (!title || !content || !imageUrl) {
        console.log("createBlog: missing fields");
        return res.status(400).json({message: "Missing required fields"});
    }

    try {
        console.log("createBlog: creating blog", title);
        const blog = await prisma.blog.create({
            data: {title, content, imageUrl},
        });
        console.log("createBlog: created", blog.id);
        return res.status(201).json(blog);
    } catch (error: any) {
        console.error("createBlog error:", error.message);
        return res.status(500).json({message: "Server Error"});
    }
};

export const updateBlog = async (req: Request, res: Response) => {
    const {id} = req.params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
        console.log("updateBlog: invalid id", id);
        return res.status(400).json({message: "Invalid blog ID"});
    }

    try {
        console.log("updateBlog: updating", blogId);
        const blog = await prisma.blog.update({
            where: {id: blogId},
            data: req.body,
        });
        console.log("updateBlog: updated", blogId);
        return res.status(200).json(blog);
    } catch (error: any) {
        if (error.code === "P2025") {
            console.log("updateBlog: not found", blogId);
            return res.status(404).json({message: "Blog not found"});
        }
        console.error("updateBlog error:", error.message);
        return res.status(500).json({message: "Server Error"});
    }
};

export const deleteBlog = async (req: Request, res: Response) => {
    const {id} = req.params;
    const blogId = Number(id);

    if (isNaN(blogId)) {
        console.log("deleteBlog: invalid id", id);
        return res.status(400).json({message: "Invalid blog ID"});
    }

    try {
        console.log("deleteBlog: deleting", blogId);
        await prisma.blog.delete({where: {id: blogId}});
        console.log("deleteBlog: deleted", blogId);
        return res.status(200).json({message: "Blog deleted successfully"});
    } catch (error: any) {
        if (error.code === "P2025") {
            console.log("deleteBlog: not found", blogId);
            return res.status(404).json({message: "Blog not found"});
        }
        console.error("deleteBlog error:", error.message);
        return res.status(500).json({message: "Server Error"});
    }
};

export default {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
};
