import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Plant from "../../../models/Plant"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  await dbConnect()

  if (req.method === "GET") {
    try {
      const plant = await Plant.findById(id).populate("category")

      if (!plant) {
        return res.status(404).json({ message: "Plant not found" })
      }

      res.status(200).json(plant)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plant" })
    }
  } else if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const plant = await Plant.findByIdAndUpdate(id, req.body, { new: true }).populate("category")

      if (!plant) {
        return res.status(404).json({ message: "Plant not found" })
      }

      res.status(200).json(plant)
    } catch (error) {
      res.status(500).json({ message: "Failed to update plant" })
    }
  } else if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const plant = await Plant.findByIdAndDelete(id)

      if (!plant) {
        return res.status(404).json({ message: "Plant not found" })
      }

      res.status(200).json({ message: "Plant deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plant" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
