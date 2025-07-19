import {Plant, Review} from '../models/model.js'

// Add a review
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plantId, rating, comment } = req.body;
    const review = await Review.create({ userId, plantId, rating, comment });

    await Plant.findByIdAndUpdate(plantId, { $push: { reviews: review._id } });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
};

// Get reviews by plant
export const getReviewsByPlant = async (req, res) => {
  try {
    const { plantId } = req.params;
    const reviews = await Review.find({ plantId })
        .populate({ path: 'userId', select: 'name' });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (deletedReview) {
      await Plant.findByIdAndUpdate(deletedReview.plantId, {
        $pull: { reviews: reviewId }
      });
    }

    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
