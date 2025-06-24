
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/inventory - Get all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const { search, category, stockStatus } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { itemCode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }

    const items = await prisma.inventoryItem.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: {
          select: {
            quantity: true,
            order: {
              select: {
                orderNumber: true,
                type: true,
                status: true
              }
            }
          }
        }
      }
    });

    // Apply stock status filter if provided
    let filteredItems = items;
    if (stockStatus) {
      filteredItems = items.filter(item => {
        const stockRatio = item.currentStock / item.minStockLevel;
        switch (stockStatus) {
          case 'critical':
            return stockRatio <= 0.5;
          case 'low':
            return stockRatio <= 1 && stockRatio > 0.5;
          case 'good':
            return stockRatio > 1;
          default:
            return true;
        }
      });
    }

    res.json(filteredItems);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// GET /api/inventory/:id - Get single inventory item
router.get('/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            order: {
              select: {
                orderNumber: true,
                type: true,
                status: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
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

    // Check if item code already exists
    const existingItem = await prisma.inventoryItem.findUnique({
      where: { itemCode }
    });

    if (existingItem) {
      return res.status(400).json({ error: 'Item code already exists' });
    }

    const item = await prisma.inventoryItem.create({
      data: {
        itemCode,
        name,
        description,
        category,
        currentStock: parseInt(currentStock),
        minStockLevel: parseInt(minStockLevel),
        unitPrice: parseFloat(unitPrice),
        location,
        method: method || 'FIFO'
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

    // Remove id from updates if present
    delete updates.id;
    delete updates.createdAt;

    // Convert numeric fields
    if (updates.currentStock) updates.currentStock = parseInt(updates.currentStock);
    if (updates.minStockLevel) updates.minStockLevel = parseInt(updates.minStockLevel);
    if (updates.unitPrice) updates.unitPrice = parseFloat(updates.unitPrice);

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: {
        ...updates,
        lastUpdated: new Date()
      }
    });

    res.json(item);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
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
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// GET /api/inventory/stats - Get inventory statistics
router.get('/inventory/stats', async (req, res) => {
  try {
    const totalItems = await prisma.inventoryItem.count();
    
    const allItems = await prisma.inventoryItem.findMany({
      select: {
        currentStock: true,
        minStockLevel: true,
        unitPrice: true
      }
    });

    const lowStockItems = allItems.filter(item => 
      item.currentStock <= item.minStockLevel
    ).length;

    const totalValue = allItems.reduce((sum, item) => 
      sum + (item.currentStock * parseFloat(item.unitPrice)), 0
    );

    res.json({
      totalItems,
      lowStockItems,
      totalValue: parseFloat(totalValue.toFixed(2))
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({ error: 'Failed to fetch inventory statistics' });
  }
});

module.exports = router;
