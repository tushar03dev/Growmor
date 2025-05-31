const prisma = require('../utils/prismaImport.js');
const asyncHandler = require('../utils/asyncHandler');

exports.addReview = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { plantId, rating, comment } = req.body;
  const review = await prisma.review.create({
    data: { userId, plantId, rating, comment }
  });
  res.status(201).json(review); 
});

exports.getReviewsByPlant = asyncHandler(async (req, res) => {
  const plantId = parseInt(req.params.plantId);
  const reviews = await prisma.review.findMany({
    where: { plantId },
    include: { user: { select: { name: true } } }
  });
  res.json(reviews);
});

exports.deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  await prisma.review.delete({ where: { id: parseInt(reviewId) } });
  res.json({ message: 'Review deleted' });
});
