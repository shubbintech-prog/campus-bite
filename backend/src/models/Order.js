import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menu_item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    total_price: { type: Number, required: true },
    order_status: {
      type: String,
      enum: ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    items: [orderItemSchema],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
// expose user_id and vendor_id aliases so frontend still works
orderSchema.virtual('user_id').get(function () {
  return this.user;
});
orderSchema.virtual('vendor_id').get(function () {
  return this.vendor;
});
orderSchema.set('toJSON', { virtuals: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
