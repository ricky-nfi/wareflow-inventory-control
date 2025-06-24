
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/profiles - Get all profiles
router.get('/profiles', async (req, res) => {
  try {
    const { role, active } = req.query;
    
    let whereClause = {};
    
    if (role) {
      whereClause.role = role;
    }
    
    if (active !== undefined) {
      whereClause.isActive = active === 'true';
    }

    const profiles = await prisma.profile.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /api/profiles/:id - Get single profile
router.get('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const profile = await prisma.profile.findUnique({
      where: { id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/profiles - Create new profile
router.post('/profiles', async (req, res) => {
  try {
    const {
      username,
      email,
      role,
      isActive
    } = req.body;

    const profile = await prisma.profile.create({
      data: {
        username,
        email,
        role: role || 'WAREHOUSE_STAFF',
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// PUT /api/profiles/:id - Update profile
router.put('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove id from updates if present
    delete updates.id;
    delete updates.createdAt;

    const profile = await prisma.profile.update({
      where: { id },
      data: updates
    });

    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// DELETE /api/profiles/:id - Delete profile (soft delete by setting isActive to false)
router.delete('/profiles/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await prisma.profile.update({
      where: { id },
      data: { isActive: false }
    });

    res.json(profile);
  } catch (error) {
    console.error('Error deactivating profile:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.status(500).json({ error: 'Failed to deactivate profile' });
  }
});

module.exports = router;
