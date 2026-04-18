const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    tier: {
      type: String,
    },
    regions: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    logoUrl: {
      type: String,
    },
    type: {
      type: String,
      enum: ['professional', 'college', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('League', leagueSchema);
