import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Plant from '../models/Plant.js';
import Product from '../models/Product.js';

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

export const addItemToCart = async (req, res) => {
  const userId = req.user.id;
  const { plantId, productId, quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }
  if (!plantId && !productId) {
    return res.status(400).json({ message: 'Either plantId or productId must be provided' });
  }

  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Find existing item
    let cartItem = await CartItem.findOne({
      cart: cart._id,
      ...(plantId ? { plant: plantId } : {}),
      ...(productId ? { product: productId } : {}),
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart: cart._id,
        plant: plantId || undefined,
        product: productId || undefined,
        quantity
      });
      cart.items.push(cartItem._id);
      await cart.save();
    }
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(itemId, { quantity }, { new: true });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartItem.findByIdAndDelete(itemId);
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

