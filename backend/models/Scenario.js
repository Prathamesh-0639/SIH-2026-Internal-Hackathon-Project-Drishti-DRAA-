const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  scenarioId: { type: String, required: true, unique: true },
  district: { type: String, required: true },
  disasterType: { type: String, required: true },
  severity: { type: String, required: true },
  date: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  effectiveCapability: { type: Number, default: 0 },
});

module.exports = mongoose.model('Scenario', scenarioSchema);
