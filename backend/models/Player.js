const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: [String],
    number: {
      type: Number,
      required: true,
    },
    height: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
    },
    dateOfBirth: {
      type: String,
    },
    hometown: {
      type: String,
    },
    college: {
      type: String,
    },
    draftYear: {
      type: Number,
    },
    team: {
      type: String,
      required: true,
    },
    stats: {
      gamesPlayed: Number,
      pointsPerGame: Number,
      reboundsPerGame: Number,
      assistsPerGame: Number,
      fieldGoalPercentage: Number,
      stealsPerGame: Number,
      blocksPerGame: Number,
    },
    seasonTrends: {
      points: [Number],
      assists: [Number],
      rebounds: [Number],
    },
    seasonHistory: [
      {
        season: String,
        league: String,
        team: String,
        gamesPlayed: Number,
        points: Number,
        rebounds: Number,
        assists: Number,
        blocks: Number,
        steals: Number,
        fieldGoalPercentage: Number,
      },
    ],
    bio: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
