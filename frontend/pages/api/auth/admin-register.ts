import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import dbConnect from "../../../lib/mongoose"
import User from "../../../models/User"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, password, adminSecret } = req.body

  if (!name || !email || !password || !adminSecret) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  if (adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: "Invalid admin secret key" })
  }

  try {
    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    })

    res.status(201).json({ message: "Admin created successfully", userId: user._id })
  } catch (error) {
    console.error("Admin registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
