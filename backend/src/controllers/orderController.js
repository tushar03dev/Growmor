import {CartItem, Order, OrderItem} from '../models/model.js';

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      firstName,
      lastName,
      city,
      street,
      state,
      pincode,
      country,
      paymentId
    } = req.body;
    const userId = req.user.id;



    const order = await Order.create({
      user: userId,
      paymentId,
      firstName,
      lastName,
      city,
      street,
      state,
      pincode,
      country,
      orderItems: orderItems.map(i => i._id)
    });

    // Create orderItems
    const orderItems = await OrderItem.insertMany(
        items.map(item => ({
          plant: item.plantId,
          orderId: order._id,
          quantity: item.quantity,
          price: item.price
        }))
    );

    // Clear the user's cart after order
    await CartItem.deleteMany({ user: userId });

    res.status(201).json(await order.populate('orderItems'));
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
        .populate({
          path: 'orderItems',
          populate: [{ path: 'plant' }, { path: 'product' }]
        })
        .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const order = await Order.findOne({
      _id: id,
      user: userId
    }).populate({
      path: 'orderItems',
      populate: [{ path: 'plant' }, { path: 'product' }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
