import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    business_name: { type: String, required: true },
    business_slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String, default: '' },
    banner_image: { type: String, default: '' },
    categories: { type: [String], default: [] },
    school_location: { type: String, required: true },
    operating_hours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
    },
    verification_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rating: { type: Number, default: 0.0 },
    total_orders: { type: Number, default: 0 },
    delivery_options: {
      pickup: { type: Boolean, default: true },
      delivery: { type: Boolean, default: false },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

vendorProfileSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
vendorProfileSchema.set('toJSON', { virtuals: true });

const VendorProfile = mongoose.model('VendorProfile', vendorProfileSchema);
export default VendorProfile;
