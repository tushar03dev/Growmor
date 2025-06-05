const prisma = require('../utils/prismaImport.js');
const asyncHandler = require('../utils/asyncHandler');

exports.getCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { plant: true } } }
  });
  res.json(cart || { items: [] });
});

exports.addItemToCart = asyncHandler(async (req, res) => {
  const userId = req.user.id; // authenticated user ID from middleware
  const { plantId, productId, quantity } = req.body;

  // Validate quantity
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number' });
  }

  // Validate at least one of plantId or productId provided
  if (!plantId && !productId) {
    return res.status(400).json({ message: 'Either plantId or productId must be provided' });
  }

  // Find the cart for the user or create a new one
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const cartId = cart.id; // Get the cart id from the cart

  // Check if the cart item already exists
  const whereCondition = {
    cartId,
    ...(plantId && { plantId }),
    ...(productId && { productId }),
  };

  let cartItem = await prisma.cartItem.findFirst({ where: whereCondition });

  if (cartItem) {
    // Update quantity if item exists
    cartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: cartItem.quantity + quantity } 
    });
  } else {
    // Create a new cart item
   cartItem = await prisma.cartItem.create({
  data: {
    cartId: cart.id,
    ...(plantId && { plantId }),
    ...(productId && { productId }),
    quantity,
      }
    });
  }


  res.json(cartItem);
});


exports.updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cartItem = await prisma.cartItem.update({
    where: { id: parseInt(itemId) },
    data: { quantity }
  });
  res.json(cartItem);
});

exports.removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  await prisma.cartItem.delete({ where: { id: parseInt(itemId) } });
  res.json({ message: 'Cart item removed' });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
  res.json({ message: 'Cart cleared' });
});

