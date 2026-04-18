const express = require('express');
const router = express.Router();
const League = require('../models/League');

function isObjectIdString(value) {
  return typeof value === 'string' && /^[a-fA-F0-9]{24}$/.test(value);
}

// Get all leagues
router.get('/', async (req, res) => {
  try {
    const leagues = await League.find();
    res.json(leagues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get league by Mongo id or URL slug (e.g. NBA, NCAA)
router.get('/:idOrSlug', async (req, res) => {
  try {
    const param = req.params.idOrSlug;
    let league = null;
    if (isObjectIdString(param)) {
      league = await League.findById(param);
    } else {
      league = await League.findOne({ slug: param });
    }
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
