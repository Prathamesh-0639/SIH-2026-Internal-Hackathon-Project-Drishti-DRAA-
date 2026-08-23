const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { getDatasetSummary } = require('./data/realData');
const authRoutes = require('./routes/authRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const capabilityRoutes = require('./routes/capabilityRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Drishti DRAA backend is online.',
    dbMode: process.env.MONGO_URI ? 'mongo' : 'simulated',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/capability', capabilityRoutes);
app.get('/api/datasets/summary', (req, res) => {
  res.json(getDatasetSummary());
});
app.get('/api/insights', (req, res) => {
  const summary = getDatasetSummary();
  const riskIndex = Math.min(100, Math.round((summary.floodEvents / 12 + summary.lightningEvents / 8000 + summary.totalFatalities / 1200) / 3));

  res.json({
    riskIndex,
    summary,
    recommendations: [
      { title: 'Flood warning escalation', detail: 'Prioritize riverine and low-lying districts before high-intensity rainfall peaks.', priority: 'High' },
      { title: 'Medical surge planning', detail: 'Prepare trauma and emergency health teams for flood and lightning-heavy districts.', priority: 'High' },
      { title: 'Logistics checkpoint audit', detail: 'Verify road clearance and shelter readiness before peak storm exposure.', priority: 'Medium' },
    ],
    hotspots: [
      { label: 'Kerala', value: '72 flood clusters' },
      { label: 'Maharashtra', value: '46 flood clusters' },
      { label: 'Assam', value: '39 flood clusters' },
      { label: 'Karnataka', value: '49 flood clusters' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`Drishti DRAA backend running on http://localhost:${PORT}`);
});
