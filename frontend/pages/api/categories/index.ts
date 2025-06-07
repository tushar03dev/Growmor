import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Category from "../../../models/Category"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const categories = await Category.find({}).sort({ createdAt: -1 })
      res.status(200).json(categories)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" })
    }
  } else if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const { name, description, image } = req.body

      const category = await Category.create({
        name,
        description,
        image,
      })

      res.status(201).json(category)
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
