const prisma = require('../utils/prismaImport');
const asyncHandler = require('../utils/asyncHandler');

exports.createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    shippingName,
    shippingPhone,
    shippingAddress,
    paymentId 
  } = req.body;

  const userId = req.user.id;

  // Create the order with shipping details
  const order = await prisma.order.create({
    data: {
      userId,
      paymentId,
      shippingName,
      shippingPhone,
      shippingAddress,
      orderItems: {
        create: items.map(item => ({
          plantId: item.plantId,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      }
    },
    include: {
      orderItems: true
    }
  });

  // Clear the user's cart after successful order
  await prisma.cartItem.deleteMany({
    where: { cart: { userId } }
  });

  res.status(201).json(order);
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      orderItems: {
        include: {
          plant: true,
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  res.json(orders);
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id: parseInt(id),
      userId
    },
    include: {
      orderItems: {
        include: {
          plant: true,
          product: true
        }
      }
    }
  });

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await prisma.order.update({
    where: { id: parseInt(id) },
    data: { status }
  });

  res.json(order);
});
