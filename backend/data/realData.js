const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

const parseCsvRows = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const rows = [];
  let currentCell = '';
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((cell) => cell !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
      continue;
    }

    currentCell += char;
  }

  if (currentCell || currentRow.length) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
};

const toNumber = (value) => {
  if (value === undefined || value === null || value === '') return 0;
  const cleaned = String(value).replace(/,/g, '').replace(/\s+/g, ' ').trim();
  if (cleaned.toUpperCase() === 'NA' || cleaned.toUpperCase() === 'N/A') return 0;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getMapCounts = (rows, key) => {
  const counts = {};
  rows.forEach((row) => {
    const val = (row[key] || '').toString().trim();
    if (val && val.toUpperCase() !== 'NA') {
      counts[val] = (counts[val] || 0) + 1;
    }
  });
  return counts;
};

const getDatasetSummary = () => {
  const floodFile = path.join(projectRoot, 'India_Floods_Inventory.csv');
  const disasterFile = path.join(projectRoot, 'disasterIND.csv');
  const lightningFile = path.join(projectRoot, 'lightning.csv');

  const floodRows = parseCsvRows(floodFile);
  const floodHeader = floodRows[0] || [];
  const floodData = floodRows.slice(1).map((row) => Object.fromEntries(floodHeader.map((key, idx) => [key, row[idx] || ''])));
  const floodCount = floodData.length;
  const floodFatalities = floodData.reduce((sum, row) => sum + toNumber(row['Human fatality']), 0);
  const floodStateCounts = getMapCounts(floodData, 'State');
  const strongestFloodState = Object.entries(floodStateCounts).sort((a, b) => b[1] - a[1])[0] || ['NA', 0];

  const disasterRows = parseCsvRows(disasterFile);
  const disasterHeader = disasterRows[0] || [];
  const disasterData = disasterRows.slice(1).map((row) => Object.fromEntries(disasterHeader.map((key, idx) => [key, row[idx] || ''])));
  const disasterCount = disasterData.length;
  const disasterTypeCounts = getMapCounts(disasterData, 'Disaster Type');
  const topDisasterType = Object.entries(disasterTypeCounts).sort((a, b) => b[1] - a[1])[0] || ['Flood', 0];

  const lightningRows = parseCsvRows(lightningFile);
  const lightningCount = lightningRows.length - 1;

  return {
    floodEvents: floodCount,
    disasterEvents: disasterCount,
    lightningEvents: lightningCount,
    totalFatalities: floodFatalities,
    affectedState: strongestFloodState[0],
    affectedStateEvents: strongestFloodState[1],
    topDisasterType: topDisasterType[0],
    topDisasterTypeCount: topDisasterType[1],
    lastUpdated: new Date().toISOString(),
    sources: ['India_Floods_Inventory.csv', 'disasterIND.csv', 'lightning.csv'],
  };
};

module.exports = { getDatasetSummary };
