import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema(
  {
    wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallet', required: true },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ['deposit', 'purchase', 'refund'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'completed',
    },
    reference: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

walletTransactionSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
walletTransactionSchema.virtual('wallet_id').get(function () {
  return this.wallet;
});
walletTransactionSchema.set('toJSON', { virtuals: true });

const WalletTransaction = mongoose.model('WalletTransaction', walletTransactionSchema);
export default WalletTransaction;
