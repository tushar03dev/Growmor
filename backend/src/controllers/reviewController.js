import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plantId, rating, comment } = req.body;

    // 1. Make sure plant exists
    const plant = await prisma.plant.findUnique({
      where: { id: Number(plantId) }
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    // OPTIONAL: prevent duplicate review
    const existing = await prisma.review.findFirst({
      where: { userId, plantId: Number(plantId) }
    });

    if (existing) {
      return res.status(400).json({ message: "You already reviewed this plant" });
    }

    // 2. Create review
    const review = await prisma.review.create({
      data: {
        userId,
        plantId: Number(plantId),
        rating,
        comment
      }
    });

    res.status(201).json(review);

  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

export const getReviewsByPlant = async (req, res) => {
  try {
    const plantId = Number(req.params.plantId);

    const reviews = await prisma.review.findMany({
      where: { plantId },
      include: {
        user: { select: { name: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(reviews);

  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const userId = req.user.id;

    // 1. Check if review exists
    const existing = await prisma.review.findUnique({
      where: { id: reviewId }
    });

    if (!existing) {
      return res.status(404).json({ message: "Review not found" });
    }

    // 2. Only creator or admin can delete
    if (existing.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not allowed to delete this review" });
    }

    // 3. Delete review
    await prisma.review.delete({
      where: { id: reviewId }
    });

    res.json({ message: "Review deleted" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
};
