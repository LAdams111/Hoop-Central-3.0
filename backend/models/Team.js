const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: true,
    },
    logoUrl: {
      type: String,
    },
    primaryColor: {
      type: String,
    },
    secondaryColor: {
      type: String,
    },
    seasons: [
      {
        year: String,
        wins: Number,
        losses: Number,
        roster: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
          },
        ],
      },
    ],
    currentSeason: {
      type: String,
      default: '2025-26',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
