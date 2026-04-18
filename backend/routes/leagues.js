const express = require('express');
const router = express.Router();
const League = require('../models/League');

// Get all leagues
router.get('/', async (req, res) => {
  try {
    const leagues = await League.find();
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get league by ID
router.get('/:id', async (req, res) => {
  try {
    const league = await League.findById(req.params.id);
    if (!league) return res.status(404).json({ message: 'League not found' });
    res.json(league);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new league
router.post('/', async (req, res) => {
  const league = new League(req.body);
  try {
    const newLeague = await league.save();
    res.status(201).json(newLeague);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
