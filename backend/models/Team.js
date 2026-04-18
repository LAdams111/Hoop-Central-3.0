import mongoose from 'mongoose';

const seasonSchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    roster: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    league: { type: mongoose.Schema.Types.ObjectId, ref: 'League', required: true, index: true },
    logoUrl: { type: String },
    currentSeason: { type: String, default: '2025-26' },
    seasons: [seasonSchema],
  },
  { timestamps: true }
);

teamSchema.index({ name: 1, league: 1 });

export default mongoose.model('Team', teamSchema);
