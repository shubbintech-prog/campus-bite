import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refresh_token: { type: String, required: true, unique: true },
    device_info: { type: String, default: 'Unknown Device' },
    ip_address: { type: String, default: '127.0.0.1' },
    expires_at: { type: Date, required: true, index: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Auto-delete expired sessions from database using a TTL index
sessionSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
export default Session;
