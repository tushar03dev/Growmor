import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Category from "../../../models/Category"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.isAdmin) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await dbConnect()

  if (req.method === "PUT") {
    try {
      const { name, description, image } = req.body

      const category = await Category.findByIdAndUpdate(id, { name, description, image }, { new: true })

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" })
    }
  } else if (req.method === "DELETE") {
    try {
      const category = await Category.findByIdAndDelete(id)

      if (!category) {
        return res.status(404).json({ message: "Category not found" })
      }

      res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
