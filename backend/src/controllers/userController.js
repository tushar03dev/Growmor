import prisma from "../utils/prisma.js";
import bcrypt from 'bcryptjs';


// GET /api/user/profile
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

// PATCH /api/user/profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;

    const data = {};

    if (name) data.name = name;
    if (email) data.email = email;

    // Hash password if updating
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data,
      select: { id: true, name: true, email: true }
    });

    res.json(updatedUser);

  } catch (err) {

    // Handle duplicate email Prisma error
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email already in use" });
    }

    res.status(500).json({ message: "Error updating user", error: err.message });
  }
};

