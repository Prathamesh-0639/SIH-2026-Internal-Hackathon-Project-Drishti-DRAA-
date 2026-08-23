const demoData = require('../data/demoData');

const getResourcesForScenario = (req, res) => {
  const resources = demoData.resources.filter((item) => item.scenarioId === req.params.scenarioId);
  res.json({ resources });
};

const updateResourceStatus = (req, res) => {
  const { scenarioId, resourceType } = req.params;
  const { availableQty, currentStatus, notes } = req.body;

  const resourceIndex = demoData.resources.findIndex(
    (item) => item.scenarioId === scenarioId && item.type.toLowerCase() === decodeURIComponent(resourceType).toLowerCase()
  );

  if (resourceIndex === -1) {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  if (availableQty !== undefined) {
    demoData.resources[resourceIndex].availableQty = Number(availableQty);
  }

  if (currentStatus) {
    demoData.resources[resourceIndex].currentStatus = currentStatus;
  }

  if (notes) {
    demoData.resources[resourceIndex].notes = notes;
  }

  demoData.resources[resourceIndex].lastUpdated = new Date().toISOString();

  return res.json({ resource: demoData.resources[resourceIndex] });
};

module.exports = { getResourcesForScenario, updateResourceStatus };
