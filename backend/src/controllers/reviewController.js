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


