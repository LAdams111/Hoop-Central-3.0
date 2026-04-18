const mongoose = require('mongoose');

const leagueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('League', leagueSchema);
