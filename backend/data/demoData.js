const bcrypt = require('bcryptjs');

const demoData = {
  users: [
    {
      id: 'u-admin-01',
      name: 'District Admin',
      email: 'admin@drishti.gov.in',
      password: bcrypt.hashSync('admin123', 10),
      role: 'admin',
    },
    {
      id: 'u-officer-01',
      name: 'Rohan Patil (DEOC/EOC)',
      email: 'officer@drishti.gov.in',
      password: bcrypt.hashSync('officer123', 10),
      role: 'officer',
    },
  ],
  scenarios: [
    {
      scenarioId: 'KOL-FLOOD-001',
      district: 'Kolhapur',
      disasterType: 'Flood',
      severity: 'High',
      date: '2026-08-15',
      isActive: true,
      effectiveCapability: 67,
    },
    {
      scenarioId: 'KOL-LAND-002',
      district: 'Kolhapur',
      disasterType: 'Landslide',
      severity: 'Medium',
      date: '2026-08-10',
      isActive: false,
      effectiveCapability: 82,
    },
  ],
  resources: [
    { scenarioId: 'KOL-FLOOD-001', type: 'Rescue Boats', plannedQty: 12, availableQty: 9, currentStatus: 'Maintenance', lastUpdated: '2026-08-15T08:00:00Z', notes: '2 boats under maintenance' },
    { scenarioId: 'KOL-FLOOD-001', type: 'Ambulances', plannedQty: 15, availableQty: 15, currentStatus: 'Available', lastUpdated: '2026-08-15T08:10:00Z', notes: 'All available' },
    { scenarioId: 'KOL-FLOOD-001', type: 'Responders', plannedQty: 100, availableQty: 88, currentStatus: 'Operator Missing', lastUpdated: '2026-08-15T08:15:00Z', notes: '12 deployed elsewhere' },
    { scenarioId: 'KOL-FLOOD-001', type: 'Shelters', plannedQty: 5, availableQty: 5, currentStatus: 'Available', lastUpdated: '2026-08-15T08:18:00Z', notes: 'All available' },
    { scenarioId: 'KOL-FLOOD-001', type: 'Critical Routes', plannedQty: 4, availableQty: 3, currentStatus: 'Blocked', lastUpdated: '2026-08-15T08:25:00Z', notes: '1 route blocked' },
    { scenarioId: 'KOL-FLOOD-001', type: 'Communication Sets', plannedQty: 8, availableQty: 7, currentStatus: 'Unavailable', lastUpdated: '2026-08-15T08:35:00Z', notes: '1 backup down' },
    { scenarioId: 'KOL-LAND-002', type: 'Rescue Boats', plannedQty: 10, availableQty: 8, currentStatus: 'Available', lastUpdated: '2026-08-10T09:00:00Z', notes: '2 boats ready' },
    { scenarioId: 'KOL-LAND-002', type: 'Ambulances', plannedQty: 12, availableQty: 10, currentStatus: 'Available', lastUpdated: '2026-08-10T09:05:00Z', notes: 'Two ambulances stand by' },
    { scenarioId: 'KOL-LAND-002', type: 'Responders', plannedQty: 80, availableQty: 70, currentStatus: 'Available', lastUpdated: '2026-08-10T09:08:00Z', notes: 'Most responders available' },
    { scenarioId: 'KOL-LAND-002', type: 'Shelters', plannedQty: 4, availableQty: 4, currentStatus: 'Available', lastUpdated: '2026-08-10T09:10:00Z', notes: 'All shelters active' },
    { scenarioId: 'KOL-LAND-002', type: 'Critical Routes', plannedQty: 3, availableQty: 2, currentStatus: 'Blocked', lastUpdated: '2026-08-10T09:12:00Z', notes: 'One route obstructed' },
    { scenarioId: 'KOL-LAND-002', type: 'Communication Sets', plannedQty: 6, availableQty: 6, currentStatus: 'Available', lastUpdated: '2026-08-10T09:15:00Z', notes: 'All sets online' },
  ],
  actions: [
    { scenarioId: 'KOL-FLOOD-001', actionName: 'Clear critical route', expectedRecovery: 24, relatedResourceType: 'Critical Routes', order: 1 },
    { scenarioId: 'KOL-FLOOD-001', actionName: 'Restore communication backup', expectedRecovery: 12, relatedResourceType: 'Communication Sets', order: 2 },
    { scenarioId: 'KOL-FLOOD-001', actionName: 'Reassign boat operator', expectedRecovery: 9, relatedResourceType: 'Rescue Boats', order: 3 },
    { scenarioId: 'KOL-FLOOD-001', actionName: 'Repair 2 boats', expectedRecovery: 8, relatedResourceType: 'Rescue Boats', order: 4 },
    { scenarioId: 'KOL-FLOOD-001', actionName: 'Recall 12 responders', expectedRecovery: 6, relatedResourceType: 'Responders', order: 5 },
  ],
};

module.exports = demoData;
