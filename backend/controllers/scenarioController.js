const demoData = require('../data/demoData');

const getScenarios = (req, res) => {
  const scenarios = demoData.scenarios.map((scenario) => ({
    ...scenario,
    resourceSummary: getScenarioSummary(scenario),
  }));

  res.json({ scenarios });
};

const getScenarioById = (req, res) => {
  const scenario = demoData.scenarios.find((item) => item.scenarioId === req.params.scenarioId);

  if (!scenario) {
    return res.status(404).json({ message: 'Scenario not found.' });
  }

  const resources = demoData.resources.filter((item) => item.scenarioId === scenario.scenarioId);
  const actions = demoData.actions.filter((item) => item.scenarioId === scenario.scenarioId);

  return res.json({
    scenario,
    resources,
    actions,
    summary: getScenarioSummary(scenario),
  });
};

const getScenarioSummary = (scenario) => {
  const resources = demoData.resources.filter((item) => item.scenarioId === scenario.scenarioId);
  const planned = resources.reduce((total, item) => total + item.plannedQty, 0);
  const available = resources.reduce((total, item) => total + item.availableQty, 0);
  const capability = scenario.effectiveCapability || Math.round((available / planned) * 100);

  return {
    planned,
    available,
    capability,
    criticalGaps: resources.filter((item) => item.availableQty < item.plannedQty).length,
  };
};

module.exports = { getScenarios, getScenarioById };
