
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/workers - Get all workers
router.get('/workers', async (req, res) => {
  try {
    const { active, shift } = req.query;
    
    let whereClause = {};
    
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }
    
    if (shift) {
      whereClause.shift = shift;
    }

    const workers = await prisma.worker.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            type: true
          }
        }
      }
    });

    res.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

// GET /api/workers/:id - Get single worker
router.get('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                item: {
                  select: {
                    name: true,
                    itemCode: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    console.error('Error fetching worker:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
});

// POST /api/workers - Create new worker
router.post('/workers', async (req, res) => {
  try {
    const {
      name,
      email,
      position,
      shift,
      ordersProcessed,
      accuracy,
      productivity,
      isActive
    } = req.body;

    // Check if email already exists
    const existingWorker = await prisma.worker.findUnique({
      where: { email }
    });

    if (existingWorker) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        email,
        position,
        shift,
        ordersProcessed: parseInt(ordersProcessed) || 0,
        accuracy: parseFloat(accuracy) || 100,
        productivity: parseFloat(productivity) || 100,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json(worker);
  } catch (error) {
    console.error('Error creating worker:', error);
    res.status(500).json({ error: 'Failed to create worker' });
  }
});

// PUT /api/workers/:id - Update worker
router.put('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove id from updates if present
    delete updates.id;
    delete updates.createdAt;

    // Convert numeric fields
    if (updates.ordersProcessed) updates.ordersProcessed = parseInt(updates.ordersProcessed);
    if (updates.accuracy) updates.accuracy = parseFloat(updates.accuracy);
    if (updates.productivity) updates.productivity = parseFloat(updates.productivity);

    const worker = await prisma.worker.update({
      where: { id },
      data: updates
    });

    res.json(worker);
  } catch (error) {
    console.error('Error updating worker:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.status(500).json({ error: 'Failed to update worker' });
  }
});

// DELETE /api/workers/:id - Delete worker
router.delete('/workers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.worker.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting worker:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Worker not found' });
    }
    res.status(500).json({ error: 'Failed to delete worker' });
  }
});

module.exports = router;
