import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String },
    password_hash: { type: String, required: true },
    roles: {
      type: [String],
      enum: ['student', 'vendor', 'admin'],
      default: ['student'],
    },
    active_role: {
      type: String,
      enum: ['student', 'vendor', 'admin'],
      default: 'student',
    },
    onboarding_completed: { type: Boolean, default: false },
    seller_onboarding_status: {
      type: String,
      enum: ['none', 'pending', 'approved'],
      default: 'none',
    },
    image_url: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Normalize emails on document save
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Virtual so req.user.id works the same as before
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
