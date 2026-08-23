const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  scenarioId: { type: String, required: true },
  actionName: { type: String, required: true },
  expectedRecovery: { type: Number, required: true },
  relatedResourceType: { type: String, required: true },
  order: { type: Number, default: 1 },
});

module.exports = mongoose.model('Action', actionSchema);
