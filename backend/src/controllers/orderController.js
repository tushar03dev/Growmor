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


    // 1. Check for existing identical address
    let address = await prisma.address.findFirst({
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

    // If not found, create new address
    if (!address) {
      address = await prisma.address.create({
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
    }

    // 2. Create Order with addressId
    const order = await prisma.order.create({
      data: {
        userId,
        paymentId,
        addressId: address.id,
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

    // 3. Create Order Items
    await prisma.orderItem.createMany({
      data: items.map(i => ({
        orderId: order.id,
        plantId: i.plantId,
        quantity: i.quantity,
        price: i.price
      }))
    });

    // 4. Clear Cart
    await prisma.cartItem.deleteMany({ where: { userId } });

    // 5. Return populated order
    const fullOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        address: true,
        orderItems: {
          include: { plant: true }
        }
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
        address: true,
        orderItems: { include: { plant: true } }
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
      where: { id: orderId, userId },
      include: {
        address: true,
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
