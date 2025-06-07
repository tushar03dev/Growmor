import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Cart from "../../../models/Cart"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await dbConnect()

  if (req.method === "GET") {
    try {
      const cart = await Cart.findOne({ user: session.user.id }).populate({
        path: "items.plant",
        populate: { path: "category" },
      })

      res.status(200).json(cart || { items: [] })
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" })
    }
  } else if (req.method === "POST") {
    try {
      const { plantId, quantity } = req.body

      let cart = await Cart.findOne({ user: session.user.id })

      if (!cart) {
        cart = new Cart({ user: session.user.id, items: [] })
      }

      const existingItemIndex = cart.items.findIndex((item) => item.plant.toString() === plantId)

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity
      } else {
        cart.items.push({ plant: plantId, quantity })
      }

      await cart.save()

      const populatedCart = await Cart.findById(cart._id).populate({
        path: "items.plant",
        populate: { path: "category" },
      })

      res.status(200).json(populatedCart)
    } catch (error) {
      res.status(500).json({ message: "Failed to add to cart" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
