const demoData = require('../data/demoData');

const getCapabilitySnapshot = (req, res) => {
  const { scenarioId } = req.params;
  const scenario = demoData.scenarios.find((item) => item.scenarioId === scenarioId);
  const resources = demoData.resources.filter((item) => item.scenarioId === scenarioId);
  const actions = demoData.actions.filter((item) => item.scenarioId === scenarioId);

  const metric = calculateCapability(resources, scenario);

  res.json({
    scenarioId,
    capability: metric.capability,
    summary: metric,
    priorityActions: actions,
  });
};

const simulateActions = (req, res) => {
  const { scenarioId, actionIds } = req.body;
  const scenario = demoData.scenarios.find((item) => item.scenarioId === scenarioId);
  const resources = demoData.resources.filter((item) => item.scenarioId === scenarioId);
  const actions = demoData.actions.filter((item) => item.scenarioId === scenarioId);

  const selected = actions.filter((action) => actionIds.includes(action.actionName));
  const improvement = selected.reduce((sum, action) => sum + Number(action.expectedRecovery), 0);
  const current = calculateCapability(resources, scenario).capability;
  const newCapability = Math.min(100, current + improvement);

  res.json({
    currentCapability: current,
    improvedCapability: newCapability,
    improvement,
    message: `Simulation shows capability improving from ${current}% to ${newCapability}% by addressing the highest-impact actions.`,
  });
};

const calculateCapability = (resources, scenario = null) => {
  if (!resources.length) {
    return { planned: 0, available: 0, capability: 0, gaps: 0 };
  }

  const planned = resources.reduce((total, item) => total + item.plannedQty, 0);
  const available = resources.reduce((total, item) => total + item.availableQty, 0);
  const capability = scenario?.effectiveCapability || Math.round((available / planned) * 100);
  const gaps = resources.filter((item) => item.availableQty < item.plannedQty).length;

  return { planned, available, capability, gaps };
};

module.exports = { getCapabilitySnapshot, simulateActions, calculateCapability };
