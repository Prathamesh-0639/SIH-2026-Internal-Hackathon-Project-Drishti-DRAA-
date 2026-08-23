const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  scenarioId: { type: String, required: true },
  type: { type: String, required: true },
  plannedQty: { type: Number, required: true },
  availableQty: { type: Number, required: true },
  currentStatus: {
    type: String,
    enum: ['Available', 'Maintenance', 'Unavailable', 'Blocked', 'Operator Missing'],
    default: 'Available',
  },
  lastUpdated: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
});

module.exports = mongoose.model('Resource', resourceSchema);
