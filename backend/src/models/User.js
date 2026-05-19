import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password_hash: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'vendor', 'admin'],
      default: 'student',
    },
    image_url: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

// Virtual so req.user.id works the same as before
userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model('User', userSchema);
export default User;
