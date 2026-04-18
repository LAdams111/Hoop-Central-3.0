import mongoose from 'mongoose';

const seasonHistoryRow = new mongoose.Schema(
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
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    externalId: { type: String, index: true, sparse: true },
    name: { type: String, required: true, index: true },
    headshotUrl: { type: String },
    jerseyNumber: { type: Number, default: 0 },
    position: { type: String, default: 'PG' },
    team: { type: String, required: true, index: true },
    birthDate: { type: Date },
    hometown: { type: String },
    bio: { type: String },
    height: { type: String },
    weight: { type: String },
    profileViews: { type: Number, default: 0, index: true },
    stats: {
      season: { type: String, default: '2025-26' },
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
    seasonHistory: [seasonHistoryRow],
  },
  { timestamps: true }
);

playerSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

playerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    ret.id = ret._id?.toString?.() ?? ret.id;
    delete ret._id;
    return ret;
  },
});

export default mongoose.model('Player', playerSchema);
