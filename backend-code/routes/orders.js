
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/orders - Get all orders
router.get('/orders', async (req, res) => {
  try {
    const { status, type, workerId } = req.query;
    
    let whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (type) {
      whereClause.type = type;
    }
    
    if (workerId) {
      whereClause.assignedWorkerId = workerId;
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedWorker: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        orderItems: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                itemCode: true,
                unitPrice: true
              }
            }
          }
        }
      }
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get single order
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        assignedWorker: true,
        orderItems: {
          include: {
            item: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create new order
router.post('/orders', async (req, res) => {
  try {
    const {
      orderNumber,
      type,
      status,
      assignedWorkerId,
      orderItems
    } = req.body;

    // Check if order number already exists
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber }
    });

    if (existingOrder) {
      return res.status(400).json({ error: 'Order number already exists' });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        type,
        status: status || 'PENDING',
        assignedWorkerId,
        orderItems: {
          create: orderItems?.map(item => ({
            itemId: item.itemId,
            quantity: parseInt(item.quantity),
            unitPrice: parseFloat(item.unitPrice)
          })) || []
        }
      },
      include: {
        assignedWorker: true,
        orderItems: {
          include: {
            item: true
          }
        }
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id - Update order
router.put('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove id from updates if present
    delete updates.id;
    delete updates.createdAt;
    delete updates.orderItems; // Handle order items separately

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...updates,
        updatedAt: new Date()
      },
      include: {
        assignedWorker: true,
        orderItems: {
          include: {
            item: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        assignedWorker: true,
        orderItems: {
          include: {
            item: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
