import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import dbConnect from "../../../lib/mongoose"
import Order from "../../../models/Order"
import Cart from "../../../models/Cart"
import Plant from "../../../models/Plant"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  await dbConnect()

  if (req.method === "GET") {
    try {
      const orders = await Order.find({ user: session.user.id })
        .populate({
          path: "items.plant",
          populate: { path: "category" },
        })
        .sort({ createdAt: -1 })

      res.status(200).json(orders)
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" })
    }
  } else if (req.method === "POST") {
    try {
      const { shippingAddress, paymentId } = req.body

      const cart = await Cart.findOne({ user: session.user.id }).populate("items.plant")

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" })
      }

      // Calculate total amount
      let totalAmount = 0
      const orderItems = []

      for (const item of cart.items) {
        const plant = item.plant
        const price = plant.price * (1 - plant.discountPercentage / 100)
        totalAmount += price * item.quantity

        orderItems.push({
          plant: plant._id,
          quantity: item.quantity,
          price: price,
        })

        // Update plant stock
        await Plant.findByIdAndUpdate(plant._id, {
          $inc: { stock: -item.quantity },
        })
      }

      const order = await Order.create({
        user: session.user.id,
        items: orderItems,
        totalAmount,
        shippingAddress,
        paymentId,
        paymentStatus: "completed",
      })

      // Clear cart
      await Cart.findByIdAndUpdate(cart._id, { items: [] })

      const populatedOrder = await Order.findById(order._id).populate({
        path: "items.plant",
        populate: { path: "category" },
      })

      res.status(201).json(populatedOrder)
    } catch (error) {
      console.error("Order creation error:", error)
      res.status(500).json({ message: "Failed to create order" })
    }
  } else {
    res.status(405).json({ message: "Method not allowed" })
  }
}
