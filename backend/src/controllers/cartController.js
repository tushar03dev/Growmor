import {Cart, CartItem, Plant} from '../models/model.js';

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: { path: "plantId" }
    });

    if (!cart) {
      console.log("🛒 Cart not found for user:", userId);
      return res.json({ items: [] });
    }

    console.log("🛒 Raw cart data:", JSON.stringify(cart, null, 2));

    // Format cart items with full plant details
    const formattedItems = cart.items.map((item) => {
      const plant = item.plantId ? item.plantId.toObject() : null;

      console.log("🌱 Raw plant object:", JSON.stringify(plant, null, 2));

      return {
        id: item._id,              // cart item id
        quantity: item.quantity,   // quantity in cart
        plant: plant
            ? {
              id: plant._id,
              name: plant.name,
              description: plant.description,
              price: plant.price,
              stock: plant.stock,
              discountPercentage: plant.discountPercentage,
              sale: plant.sale,
              salePrice: plant.salePrice,
              featured: plant.featured,
              isTrending: plant.isTrending,
              isBestSeller: plant.isBestSeller,
              createdAt: plant.createdAt,
              image: plant.image?.imageUrl || null, // ✅ direct usable image
            }
            : null,
      };
    });

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
    res.json(cartItem);
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