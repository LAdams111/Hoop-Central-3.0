const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const League = require('../models/League');

// Get all teams or teams by league
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.leagueSlug) {
      const lg = await League.findOne({ slug: req.query.leagueSlug });
      if (!lg) {
        return res.json([]);
      }
      query.league = lg._id;
    } else if (req.query.league) {
      query.league = req.query.league;
    }
    const teams = await Team.find(query).populate('league');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get team by ID with roster
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('league')
      .populate({
        path: 'seasons.roster',
        model: 'Player',
      });
    if (!team) return res.status(404).json({ message: 'Team not found' });
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new team
router.post('/', async (req, res) => {
  const team = new Team(req.body);
  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update team
router.patch('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    Object.assign(team, req.body);
    const updatedTeam = await team.save();
    res.json(updatedTeam);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
