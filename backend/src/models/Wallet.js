import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance: { type: Number, default: 0.0 },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

walletSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
walletSchema.virtual('user_id').get(function () {
  return this.user;
});
walletSchema.set('toJSON', { virtuals: true });

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
