import {Cart, CartItem, Plant} from '../models/model.js';
import {getObjectURL} from "../utils/s3Utils.js";

// UTIL: Generates a signed S3 URL for a Plant image, if available
const withImageUrl = async (plantDoc) => {
  if (!plantDoc) return plantDoc;

  // ensure plain object
  const plant = typeof plantDoc.toObject === "function" ? plantDoc.toObject() : plantDoc;

  if (!plant.image || !plant.image.key) return plant;

  try {
    const imageUrl = await getObjectURL(plant.image.key); // presigned URL
    return {
      ...plant,
      image: {
        ...plant.image,
        imageUrl, // ✅ usable signed url
      },
    };
  } catch (err) {
    console.error("❌ Failed to generate signed URL for plant:", plant._id, err);
    return plant; // fallback without URL
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: { path: "plantId" },
    });

    if (!cart) {
      return res.json({ items: [] });
    }

    // format items
    const rawItems = cart.items.map((item) => {
      const plant = item.plantId ? item.plantId.toObject() : null;
      return {
        id: item._id,
        quantity: item.quantity,
        plant,
      };
    });

    // add signed urls in parallel
    const formattedItems = await Promise.all(
        rawItems.map(async (item) => {
          if (item.plant) {
            const plantWithUrl = await withImageUrl(item.plant);
            return { ...item, plant: plantWithUrl };
          }
          return item;
        })
    );

    res.json({ items: formattedItems });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const addItemToCart = async (req, res) => {
  const userId = req.user?.id || req.body.userId;
  const { plantId, quantity } = req.body;

  if (!userId) {
    console.log(userId);
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (!plantId) {
    return res.status(400).json({ message: "PlantId must be provided" });
  }
  const qty = parseInt(quantity, 10);
  if (!qty || qty <= 0) {
    return res.status(400).json({ message: "Quantity must be a positive number" });
  }

  try {
    // Fetch plant to check stock
    const plant = await Plant.findById(plantId);
    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    if (plant.stock < qty) {
      return res.status(400).json({ message: `Only ${plant.stock} item(s) in stock` });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    // Find cart item
    let cartItem = await CartItem.findOne({ cartId: cart._id, plantId });

    if (cartItem) {
      const newQuantity = cartItem.quantity + qty;
      if (plant.stock < newQuantity) {
        return res.status(400).json({ message: `Only ${plant.stock} item(s) in stock` });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart._id,
        plantId,
        quantity: qty,
      });
      cart.items.push(cartItem._id);
      await cart.save();
    }

    // Populate plant details in response
    cartItem = await CartItem.findById(cartItem._id).populate({
      path: "plantId",
      select:
          "name description price stock image.discountPercentage sale salePrice isTrending isBestSeller featured",
    });

    res.json(cartItem);
  } catch (error) {
    console.error("Error in addItemToCart:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const cartItem = await CartItem.findByIdAndUpdate(itemId, { quantity }, { new: true });
    res.status(204).json({ message: "CartItem updated" });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartItem.findByIdAndDelete(itemId);
    res.json({ message: 'Cart item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (cart) {
      await CartItem.deleteMany({ cart: cart._id });
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export default {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
}