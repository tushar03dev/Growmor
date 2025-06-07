import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Blog from "../../../models/Blog"
import { generateSlug } from "../../../lib/utils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const { published } = req.query
      const filter = published === "true" ? { published: true } : {}

      const blogs = await Blog.find(filter).populate("author", "name").sort({ createdAt: -1 })

      res.status(200).json(blogs)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blogs" })
    }
  } else if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const { title, content, excerpt, image, category, tags, published } = req.body

      const slug = generateSlug(title)

      const blog = await Blog.create({
        title,
        content,
        excerpt,
        image,
        author: session.user.id,
        category,
        tags,
        published,
        slug,
      })

      const populatedBlog = await Blog.findById(blog._id).populate("author", "name")
      res.status(201).json(populatedBlog)
    } catch (error) {
      res.status(500).json({ message: "Failed to create blog" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
