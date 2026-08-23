import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStoredScenario } from '../data/scenarioProfile';

const CapabilityView = () => {
  const [selectedScenario, setSelectedScenario] = useState(() => getStoredScenario());

  useEffect(() => {
    const syncScenario = () => setSelectedScenario(getStoredScenario());
    syncScenario();

    const onScenarioUpdate = () => syncScenario();
    window.addEventListener('drishti-scenario-updated', onScenarioUpdate);
    window.addEventListener('storage', onScenarioUpdate);

    return () => {
      window.removeEventListener('drishti-scenario-updated', onScenarioUpdate);
      window.removeEventListener('storage', onScenarioUpdate);
    };
  }, []);

  const capability = Math.min(100, Math.max(0, Number(selectedScenario.capability ?? 67) || 0));
  const summary = selectedScenario.summary ?? { planned: 144, available: 127, capability, gaps: 3, potentialRecovery: 53 };
  const actions = selectedScenario.actions || [];
  const recoveryTotal = actions.reduce((sum, action) => sum + Math.min(100, Math.max(0, Number(action.expectedRecovery || 0))), 0);
  const avgRecovery = actions.length ? Math.min(100, Math.round(recoveryTotal / actions.length)) : 0;
  const statusColor = capability < 70 ? 'danger' : capability < 86 ? 'warning' : 'success';
  const scenarioNarrative = `${selectedScenario.district} ${selectedScenario.disasterType} · ${selectedScenario.severity} severity`;

  const metricCards = [
    { label: 'Effective capability', value: `${capability}%`, accent: 'primary' },
    { label: 'Planned resources', value: summary.planned ?? 0, accent: 'info' },
    { label: 'Available resources', value: summary.available ?? 0, accent: 'success' },
    { label: 'Critical gaps', value: summary.gaps ?? summary.criticalGaps ?? 0, accent: 'warning' },
    { label: 'Potential recovery', value: `${Math.min(100, Math.max(0, Number(summary.potentialRecovery ?? recoveryTotal ?? 0))) }%`, accent: 'danger' },
  ];

  const chartData = actions.map((action) => ({
    name: action.actionName.length > 16 ? `${action.actionName.slice(0, 16)}...` : action.actionName,
    recovery: Math.min(100, Math.max(0, Number(action.expectedRecovery || 0))),
    resource: action.relatedResourceType,
  }));

  const readinessBands = [
    { label: 'Route access', value: Math.min(100, Math.max(0, Math.round(capability * (selectedScenario.disasterType === 'Flood' ? 0.9 : selectedScenario.disasterType === 'Landslide' ? 0.82 : 0.86)))), tone: 'danger' },
    { label: 'Communication', value: Math.min(100, Math.max(0, Math.round(capability * 0.92))), tone: 'warning' },
    { label: 'Rescue readiness', value: Math.min(100, Math.max(0, Math.round(capability * 0.97))), tone: 'primary' },
    { label: 'Medical support', value: Math.min(100, Math.max(0, Math.round(capability * 1.03))), tone: 'success' },
  ];

  return (
    <div className="page-shell p-4" style={{ minHeight: 'auto' }}>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="text-uppercase small text-muted fw-semibold mb-2">Capability assessment</div>
              <div className={`display-3 fw-bold text-${statusColor}`}>{capability}%</div>
              <p className="text-muted mb-0 mt-2">Operational readiness for the {scenarioNarrative} scenario under district command review.</p>
            </div>
            <div className="col-lg-5">
              <div className="bg-light rounded-4 p-3 border">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-muted">Readiness status</span>
                  <span className={`badge text-bg-${statusColor}`}>{capability >= 85 ? 'Ready' : capability >= 70 ? 'Watchlist' : 'Critical'}</span>
                </div>
                <div className="progress" style={{ height: '16px' }}>
                  <div
                    className={`progress-bar bg-${statusColor}`}
                    role="progressbar"
                    style={{ width: `${capability}%` }}
                    aria-valuenow={capability}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
                <div className="d-flex justify-content-between mt-2 small text-muted">
                  <span>0%</span>
                  <span>{capability}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {metricCards.map((card) => (
          <div className="col-md-4 col-xl-2" key={card.label}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <div className={`text-${card.accent} small text-uppercase fw-semibold`}>{card.label}</div>
                <div className="fs-3 fw-bold mt-2">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Action recovery potential</h5>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="recovery" fill="#0056b3" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">System readiness</h5>
              {readinessBands.map((band) => (
                <div className="mb-3" key={band.label}>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>{band.label}</span>
                    <span>{band.value}%</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div
                      className={`progress-bar bg-${band.tone}`}
                      role="progressbar"
                      style={{ width: `${band.value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="mt-3 small text-muted">
                Average action recovery: <strong className="text-dark">{avgRecovery}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Priority actions</h5>
              <div className="list-group list-group-flush">
                {actions.map((action) => (
                  <div key={action.actionName} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-semibold">{action.actionName}</div>
                      <div className="small text-muted">{action.relatedResourceType}</div>
                    </div>
                    <span className="badge text-bg-warning">+{action.expectedRecovery}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Operational note</h5>
              <div className="alert alert-light border mb-0">
                DRAA is an operational-assurance layer and does not replace existing systems (NDEM, IDRN, SACHET, SEOC).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapabilityView;
