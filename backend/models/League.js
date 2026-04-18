import mongoose from 'mongoose';

const leagueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    tier: { type: String, default: 'Professional' },
    regions: [{ type: String }],
    description: { type: String },
    logoUrl: { type: String },
    apiKey: { type: String, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('League', leagueSchema);
