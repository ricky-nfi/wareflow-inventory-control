
// Example API routes for your backend server using Prisma
// This file shows how to structure your backend routes

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/inventory - Get all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// POST /api/inventory - Create new inventory item
router.post('/inventory', async (req, res) => {
  try {
    const {
      itemCode,
      name,
      description,
      category,
      currentStock,
      minStockLevel,
      unitPrice,
      location,
      method
    } = req.body;

    const item = await prisma.inventoryItem.create({
      data: {
        itemCode,
        name,
        description,
        category,
        currentStock,
        minStockLevel,
        unitPrice,
        location,
        method
      }
    });

    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// PUT /api/inventory/:id - Update inventory item
router.put('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: updates
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// DELETE /api/inventory/:id - Delete inventory item
router.delete('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.inventoryItem.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

module.exports = router;
