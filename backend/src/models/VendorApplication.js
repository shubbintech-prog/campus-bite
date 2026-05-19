import mongoose from 'mongoose';

const vendorApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    business_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    food_category: { type: String, required: true },
    description: { type: String },
    location_landmark: { type: String },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

vendorApplicationSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
vendorApplicationSchema.virtual('user_id').get(function () {
  return this.user;
});
vendorApplicationSchema.set('toJSON', { virtuals: true });

const VendorApplication = mongoose.model('VendorApplication', vendorApplicationSchema);
export default VendorApplication;
