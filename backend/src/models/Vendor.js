import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema(
  {
    vendor_name: { type: String, required: true },
    owner_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    location: { type: String },
    location_landmark: { type: String },
    image_url: { type: String },
    rating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'active',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

vendorSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
vendorSchema.set('toJSON', { virtuals: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
