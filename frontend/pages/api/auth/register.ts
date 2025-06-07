import type { NextApiRequest, NextApiResponse } from "next"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import User from "@/models/User"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, password, adminSecret } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    await dbConnect()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const role = adminSecret === process.env.ADMIN_SECRET_KEY ? "admin" : "user"

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
