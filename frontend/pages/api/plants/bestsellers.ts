import type { NextApiRequest, NextApiResponse } from "next"
import dbConnect from "../../../lib/mongoose"
import Plant from "../../../models/Plant"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    await dbConnect()

    const bestSellerPlants = await Plant.find({ isBestSeller: true })
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(8)

    res.status(200).json(bestSellerPlants)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bestseller plants" })
  }
}
