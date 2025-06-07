import type { NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import stripe from "../../../lib/stripe"
import dbConnect from "../../../lib/mongoose"
import Cart from "../../../models/Cart"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    await dbConnect()

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.plant")

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" })
    }

    // Calculate total amount
    let totalAmount = 0
    for (const item of cart.items) {
      const plant = item.plant
      const price = plant.price * (1 - plant.discountPercentage / 100)
      totalAmount += price * item.quantity
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: "inr",
      metadata: {
        userId: session.user.id,
      },
    })

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      amount: totalAmount,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    res.status(500).json({ message: "Failed to create payment intent" })
  }
}
