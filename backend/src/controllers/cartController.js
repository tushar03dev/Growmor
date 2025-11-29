import { PrismaClient } from "@prisma/client";
import { getObjectURL } from "../utils/s3Utils.js";

const prisma = new PrismaClient();

const withImageUrl = async (plant) => {
  if (!plant || !plant.imageKey) return plant;
  try {
    const url = await getObjectURL(plant.imageKey);
    return { ...plant, imageUrl: url };
  } catch (err) {
    console.log("generate url failed", plant.id, err);
    return plant;
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("getCart userId", userId);

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            plant: true
          }
        }
      }
    });

    if (!cart) {
      console.log("cart not found");
      return res.json({ items: [] });
    }

    const formatted = await Promise.all(
        cart.items.map(async (item) => {
          const plant = item.plant ? await withImageUrl(item.plant) : null;
          return {
            id: item.id,
            quantity: item.quantity,
            plant
          };
        })
    );

    console.log("getCart response prepared");
    res.json({ items: formatted });
  } catch (error) {
    console.log("getCart error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { plantId, quantity } = req.body;

    console.log("addItemToCart input", { userId, plantId, quantity });

    if (!userId) return res.status(401).json({ message: "User not authenticated" });
    if (!plantId) return res.status(400).json({ message: "PlantId must be provided" });

    const qty = parseInt(quantity, 10);
    if (!qty || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive number" });
    }

    const plant = await prisma.plant.findUnique({ where: { id: Number(plantId) } });
    if (!plant) return res.status(404).json({ message: "Plant not found" });
    if (plant.stock < qty) {
      return res.status(400).json({ message: `Only ${plant.stock} item(s) in stock` });
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      console.log("creating new cart");
      cart = await prisma.cart.create({ data: { userId } });
    }

    let cartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, plantId: Number(plantId) }
    });

    if (cartItem) {
      const updatedQuantity = cartItem.quantity + qty;
      if (plant.stock < updatedQuantity) {
        return res.status(400).json({ message: `Only ${plant.stock} item(s) in stock` });
      }

      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: updatedQuantity }
      });

      console.log("cartItem updated", cartItem.id);
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          plantId: Number(plantId),
          quantity: qty
        }
      });

      console.log("cartItem created", cartItem.id);
    }

    const populated = await prisma.cartItem.findUnique({
      where: { id: cartItem.id },
      include: {
        plant: true
      }
    });

    const plantWithUrl = populated.plant ? await withImageUrl(populated.plant) : null;

    console.log("addItemToCart completed");
    res.json({
      id: populated.id,
      quantity: populated.quantity,
      plant: plantWithUrl
    });
  } catch (error) {
    console.log("addItemToCart error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    console.log("updateCartItem", { itemId, quantity });

    await prisma.cartItem.update({
      where: { id: Number(itemId) },
      data: { quantity: Number(quantity) }
    });

    console.log("updateCartItem success", itemId);
    res.status(204).json({ message: "CartItem updated" });
  } catch (error) {
    console.log("updateCartItem error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log("removeItemFromCart", itemId);

    await prisma.cartItem.delete({
      where: { id: Number(itemId) }
    });

    console.log("removeItemFromCart success", itemId);
    res.json({ message: "Cart item removed" });
  } catch (error) {
    console.log("removeItemFromCart error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("clearCart userId", userId);

    const cart = await prisma.cart.findUnique({ where: { userId } });

    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      console.log("cart cleared", cart.id);
    }

    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.log("clearCart error", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export default {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart
};
