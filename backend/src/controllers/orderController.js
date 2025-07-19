import {Order} from '../models/model.js';

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingName,
      shippingPhone,
      shippingAddress,
      paymentId
    } = req.body;
    const userId = req.user.id;

    // Create orderItems
    const orderItems = await OrderItem.insertMany(
        items.map(item => ({
          plant: item.plantId,
          product: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
    );

    const order = await Order.create({
      user: userId,
      paymentId,
      shippingName,
      shippingPhone,
      shippingAddress,
      orderItems: orderItems.map(i => i._id)
    });

    // Clear the user's cart after order
    await CartItem.deleteMany({ user: userId });

    res.status(201).json(await order.populate('orderItems'));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};





