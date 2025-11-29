import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      firstName,
      lastName,
      phone,
      street,
      city,
      state,
      pincode,
      country,
      paymentId
    } = req.body;

    const userId = req.user.id;

    // 1. Check if SAME address already exists for this user
    const existingAddress = await prisma.address.findFirst({
      where: {
        userId,
        firstName,
        lastName,
        phone,
        street,
        city,
        state,
        pincode,
        country
      }
    });

    let addressId;

    if (existingAddress) {
      addressId = existingAddress.id;
    } else {
      const newAddress = await prisma.address.create({
        data: {
          userId,
          firstName,
          lastName,
          phone,
          street,
          city,
          state,
          pincode,
          country
        }
      });
      addressId = newAddress.id;
    }

    // 2. Create Order
    const order = await prisma.order.create({
      data: {
        userId,
        paymentId,
        firstName,
        lastName,
        phone,
        street,
        city,
        state,
        pincode,
        country
      }
    });

    // Create Order Items
    const orderItems = await prisma.orderItem.createMany({
      data: items.map((i) => ({
        orderId: order.id,
        plantId: i.plantId,
        quantity: i.quantity,
        price: i.price
      }))
    });

    //Clear user cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    // Return populated order
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: { include: { plant: true } }
      }
    });

    res.status(201).json(fullOrder);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: {
          include: { plant: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      },
      include: {
        orderItems: { include: { plant: true } }
      }
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(order);

  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
