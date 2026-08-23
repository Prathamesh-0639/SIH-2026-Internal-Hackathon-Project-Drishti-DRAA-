const districtEventDates = {
  Kolhapur: {
    Flood: {
      High: '2016-11-07T00:00:00Z',
      Medium: '2019-08-27T00:00:00Z',
      Low: '2021-07-14T00:00:00Z',
    },
    Landslide: {
      High: '2019-07-12T00:00:00Z',
      Medium: '2020-08-03T00:00:00Z',
      Low: '2022-06-18T00:00:00Z',
    },
    Cyclone: {
      High: '2019-11-25T00:00:00Z',
      Medium: '2021-09-10T00:00:00Z',
      Low: '2023-05-22T00:00:00Z',
    },
  },
  Pune: {
    Flood: {
      High: '2015-07-20T00:00:00Z',
      Medium: '2016-01-07T00:00:00Z',
      Low: '2022-07-02T00:00:00Z',
    },
    Landslide: {
      High: '2015-07-20T00:00:00Z',
      Medium: '2018-07-16T00:00:00Z',
      Low: '2021-06-11T00:00:00Z',
    },
    Cyclone: {
      High: '2020-11-23T00:00:00Z',
      Medium: '2022-10-09T00:00:00Z',
      Low: '2023-06-06T00:00:00Z',
    },
  },
};

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const severityFactors = {
  High: 0.68,
  Medium: 0.79,
  Low: 0.88,
};

const severityBoost = {
  High: 1,
  Medium: 0.8,
  Low: 0.6,
};

const districtModifiers = {
  Kolhapur: 0.96,
  Pune: 1.04,
};

const disasterModifiers = {
  Flood: 1,
  Landslide: 0.92,
  Cyclone: 0.94,
};

const scenarioResourceScale = {
  Low: 0.88,
  Medium: 1.04,
  High: 1.22,
};

const disasterActionMap = {
  Flood: [
    { actionName: 'Clear critical drainage route', expectedRecovery: 26, relatedResourceType: 'Critical Routes' },
    { actionName: 'Restore communication backup', expectedRecovery: 14, relatedResourceType: 'Communication Sets' },
    { actionName: 'Reassign boat operator', expectedRecovery: 11, relatedResourceType: 'Rescue Boats' },
    { actionName: 'Deploy temporary shelter network', expectedRecovery: 9, relatedResourceType: 'Shelters' },
    { actionName: 'Recall 12 responders', expectedRecovery: 7, relatedResourceType: 'Responders' },
  ],
  Landslide: [
    { actionName: 'Open alternate access corridor', expectedRecovery: 24, relatedResourceType: 'Critical Routes' },
    { actionName: 'Mobilize terrain rescue teams', expectedRecovery: 16, relatedResourceType: 'Responders' },
    { actionName: 'Restore field communications', expectedRecovery: 12, relatedResourceType: 'Communication Sets' },
    { actionName: 'Shift ambulances to safe staging points', expectedRecovery: 10, relatedResourceType: 'Ambulances' },
    { actionName: 'Clear debris from key route', expectedRecovery: 8, relatedResourceType: 'Critical Routes' },
  ],
  Cyclone: [
    { actionName: 'Pre-position emergency shelter kits', expectedRecovery: 22, relatedResourceType: 'Shelters' },
    { actionName: 'Reinforce communication redundancy', expectedRecovery: 15, relatedResourceType: 'Communication Sets' },
    { actionName: 'Stage ambulances at safe hubs', expectedRecovery: 12, relatedResourceType: 'Ambulances' },
    { actionName: 'Activate cyclone rescue teams', expectedRecovery: 11, relatedResourceType: 'Responders' },
    { actionName: 'Clear coastal access route', expectedRecovery: 9, relatedResourceType: 'Critical Routes' },
  ],
};

const baseResources = [
  { type: 'Rescue Boats', plannedQty: 12, notes: 'Flood rescue coverage and swift movement capacity' },
  { type: 'Ambulances', plannedQty: 15, notes: 'Medical evacuation and advanced life support availability' },
  { type: 'Responders', plannedQty: 100, notes: 'Field teams and rescue specialists deployed in district network' },
  { type: 'Shelters', plannedQty: 5, notes: 'Temporary relief accommodation and mass care capacity' },
  { type: 'Critical Routes', plannedQty: 4, notes: 'Access corridors and evacuation logistics' },
  { type: 'Communication Sets', plannedQty: 8, notes: 'Inter-agency command and control connectivity' },
];

const buildStatus = (available, planned) => {
  const ratio = available / planned;
  if (ratio < 0.6) return 'Blocked';
  if (ratio < 0.75) return 'Unavailable';
  if (ratio < 0.9) return 'Maintenance';
  if (ratio < 1) return 'Operator Missing';
  return 'Available';
};

export const getScenarioProfile = ({ district = 'Kolhapur', disasterType = 'Flood', severity = 'High' } = {}) => {
  const factor = severityFactors[severity] || severityFactors.High;
  const eventDate = districtEventDates[district]?.[disasterType]?.[severity] || districtEventDates.Kolhapur.Flood.High;
  const districtFactor = districtModifiers[district] || 1;
  const disasterFactor = disasterModifiers[disasterType] || 1;

  const resources = baseResources.map((resource, index) => {
    const demandScale = scenarioResourceScale[severity] || 1;
    const districtScale = districtModifiers[district] || 1;
    const disasterScale = disasterModifiers[disasterType] || 1;
    const plannedQty = Math.max(1, Math.round(resource.plannedQty * demandScale * districtScale * disasterScale * (index % 2 === 0 ? 1.08 : 1)));

    const readinessRate = {
      Flood: 0.8,
      Landslide: 0.74,
      Cyclone: 0.7,
    }[disasterType] || 0.76;

    const scenarioReadiness = severity === 'High' ? readinessRate - 0.12 : severity === 'Medium' ? readinessRate : readinessRate + 0.12;
    const availableQty = Math.max(0, Math.round(plannedQty * Math.min(0.98, Math.max(0.48, scenarioReadiness * (district === 'Pune' ? 1.08 : 0.96)))));

    return {
      scenarioId: `${district.toUpperCase().slice(0, 3)}-${disasterType.toUpperCase().slice(0, 3)}-${severity.toUpperCase().slice(0, 1)}-001`,
      type: resource.type,
      plannedQty,
      availableQty,
      currentStatus: buildStatus(availableQty, plannedQty),
      lastUpdated: eventDate,
      notes: resource.notes,
    };
  });

  const plannedTotal = resources.reduce((sum, resource) => sum + resource.plannedQty, 0);
  const availableTotal = resources.reduce((sum, resource) => sum + resource.availableQty, 0);
  const baseReadiness = (availableTotal / plannedTotal) * 100;
  const capability = clampPercent(Math.round(baseReadiness * districtFactor * disasterFactor * (severityBoost[severity] || 1) * 1.05));

  const actionBase = disasterActionMap[disasterType] || disasterActionMap.Flood;
  const actions = actionBase.map((action) => ({
    ...action,
    expectedRecovery: clampPercent(Math.max(4, Math.round(action.expectedRecovery * (severityBoost[severity] || 1) * districtFactor * disasterFactor))),
  }));

  const potentialRecovery = actions.reduce((sum, action) => sum + Number(action.expectedRecovery || 0), 0);

  return {
    district,
    disasterType,
    severity,
    capability,
    summary: {
      planned: plannedTotal,
      available: availableTotal,
      capability,
      criticalGaps: resources.filter((resource) => resource.availableQty < resource.plannedQty).length,
      potentialRecovery: clampPercent(Math.round(potentialRecovery)),
      gaps: resources.filter((resource) => resource.availableQty < resource.plannedQty).length,
    },
    resources,
    actions,
    scenarioId: `${district.toUpperCase().slice(0, 3)}-${disasterType.toUpperCase().slice(0, 3)}-${severity.toUpperCase().slice(0, 1)}-001`,
  };
};

export const getStoredScenario = () => {
  try {
    const raw = localStorage.getItem('drishti-scenario');
    if (!raw) {
      return getScenarioProfile({ district: 'Kolhapur', disasterType: 'Flood', severity: 'High' });
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.district || !parsed.disasterType || !parsed.severity) {
      return getScenarioProfile({ district: 'Kolhapur', disasterType: 'Flood', severity: 'High' });
    }

    return getScenarioProfile({
      district: parsed.district,
      disasterType: parsed.disasterType,
      severity: parsed.severity,
    });
  } catch {
    return getScenarioProfile({ district: 'Kolhapur', disasterType: 'Flood', severity: 'High' });
  }
};

export const setStoredScenario = (scenario) => {
  const normalized = scenario && scenario.district && scenario.disasterType && scenario.severity
    ? getScenarioProfile({
        district: scenario.district,
        disasterType: scenario.disasterType,
        severity: scenario.severity,
      })
    : scenario;

  localStorage.setItem('drishti-scenario', JSON.stringify(normalized));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('drishti-scenario-updated', { detail: normalized }));
  }
};
