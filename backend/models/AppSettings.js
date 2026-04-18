import mongoose from 'mongoose';

const appSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'global' },
    featuredPlayerIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
  },
  { timestamps: true }
);

export default mongoose.model('AppSettings', appSettingsSchema);
