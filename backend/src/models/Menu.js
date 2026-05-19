import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  menu_name: { type: String, required: true },
});

menuSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
menuSchema.set('toJSON', { virtuals: true });

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
