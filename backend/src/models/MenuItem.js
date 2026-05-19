import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image_url: { type: String },
  available: { type: Boolean, default: true },
  category: { type: String },
});

menuItemSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
menuItemSchema.set('toJSON', { virtuals: true });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
