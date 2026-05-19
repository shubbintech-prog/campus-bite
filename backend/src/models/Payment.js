import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    payment_method: { type: String },
    payment_status: { type: String, default: 'pending' },
    transaction_reference: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

paymentSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
paymentSchema.set('toJSON', { virtuals: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
