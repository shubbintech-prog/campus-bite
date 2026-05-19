import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['placed', 'paid', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'],
    required: true,
  },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now },
});

const orderTimelineSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    events: [timelineEventSchema],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const OrderTimeline = mongoose.model('OrderTimeline', orderTimelineSchema);
export default OrderTimeline;
