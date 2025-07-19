import Cart from '../models/model.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items',
      populate: [{ path: 'plant' }, { path: 'product' }]
    });
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};





