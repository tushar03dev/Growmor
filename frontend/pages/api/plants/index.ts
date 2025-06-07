import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Plant from "../../../models/Plant"
import formidable from "formidable"
import { uploadImage } from "../../../lib/cloudinary"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const plants = await Plant.find({}).populate("category").sort({ createdAt: -1 })
      res.status(200).json(plants)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plants" })
    }
  } else if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.isAdmin) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    try {
      const form = formidable({
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024, // 10MB
      })

      const [fields, files] = await form.parse(req)

      const imageUrls = []

      if (files.images) {
        const imageFiles = Array.isArray(files.images) ? files.images : [files.images]

        for (const file of imageFiles) {
          const imageUrl = await uploadImage(file.filepath)
          imageUrls.push({ url: imageUrl, alt: fields.name?.[0] || "" })
        }
      }

      const plant = await Plant.create({
        name: fields.name?.[0],
        description: fields.description?.[0],
        price: Number(fields.price?.[0]),
        discountPercentage: Number(fields.discountPercentage?.[0]) || 0,
        category: fields.category?.[0],
        stock: Number(fields.stock?.[0]),
        images: imageUrls,
        isTrending: fields.isTrending?.[0] === "true",
        isBestSeller: fields.isBestSeller?.[0] === "true",
        difficulty: fields.difficulty?.[0] || "Easy",
        careInstructions: {
          light: fields.light?.[0],
          water: fields.water?.[0],
          temperature: fields.temperature?.[0],
          humidity: fields.humidity?.[0],
        },
      })

      const populatedPlant = await Plant.findById(plant._id).populate("category")
      res.status(201).json(populatedPlant)
    } catch (error) {
      console.error("Plant creation error:", error)
      res.status(500).json({ message: "Failed to create plant" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
