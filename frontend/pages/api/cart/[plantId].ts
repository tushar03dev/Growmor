import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Cart from "../../../models/Cart"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { plantId } = req.query
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await dbConnect()

  if (req.method === "PUT") {
    try {
      const { quantity } = req.body

      const cart = await Cart.findOne({ user: session.user.id })

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
      }

      const itemIndex = cart.items.findIndex((item) => item.plant.toString() === plantId)

      if (itemIndex === -1) {
        return res.status(404).json({ message: "Item not found in cart" })
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1)
      } else {
        cart.items[itemIndex].quantity = quantity
      }

      await cart.save()

      const populatedCart = await Cart.findById(cart._id).populate({
        path: "items.plant",
        populate: { path: "category" },
      })

      res.status(200).json(populatedCart)
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart" })
    }
  } else if (req.method === "DELETE") {
    try {
      const cart = await Cart.findOne({ user: session.user.id })

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" })
      }

      cart.items = cart.items.filter((item) => item.plant.toString() !== plantId)

      await cart.save()

      const populatedCart = await Cart.findById(cart._id).populate({
        path: "items.plant",
        populate: { path: "category" },
      })

      res.status(200).json(populatedCart)
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from cart" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
