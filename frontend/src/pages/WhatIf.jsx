import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStoredScenario } from '../data/scenarioProfile';

const WhatIf = () => {
  const currentScenario = getStoredScenario();
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  const actions = currentScenario.actions || [];

  const currentCapability = currentScenario.capability || 67;

  const chartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Current', value: currentCapability },
      { name: 'Projected', value: result.improvedCapability },
    ];
  }, [currentCapability, result]);

  const handleToggle = (actionName) => {
    setSelected((prev) =>
      prev.includes(actionName) ? prev.filter((item) => item !== actionName) : [...prev, actionName]
    );
  };

  const handleSimulate = () => {
    const chosen = actions.filter((action) => selected.includes(action.actionName));
    const improvement = chosen.reduce((sum, action) => sum + Number(action.expectedRecovery), 0);
    const improvedCapability = Math.min(100, currentCapability + improvement);

    setResult({
      improvement,
      improvedCapability,
      chosen,
      message: `By resolving ${chosen.length || 0} targeted response actions, capability rises from ${currentCapability}% to ${improvedCapability}%.`,
    });
  };

  return (
    <div className="page-shell p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">What-If Simulator</h3>
        <span className="badge text-bg-primary">{currentScenario.district} · {currentScenario.disasterType} · {currentScenario.severity}</span>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Priority actions</h5>
              <div className="mb-3">
                {actions.map((action) => (
              <div key={action.actionName} className="action-option form-check d-flex align-items-center gap-3 mb-3 border rounded-3 p-3 bg-light-subtle">
                    <input
                  className="form-check-input mt-0"
                      type="checkbox"
                      checked={selected.includes(action.actionName)}
                      onChange={() => handleToggle(action.actionName)}
                    />
                <label className="form-check-label mb-0">
                      {action.actionName} <span className="text-warning fw-semibold">(+{action.expectedRecovery}%)</span>
                    </label>
                  </div>
                ))}
              </div>

              <button className="btn btn-primary" onClick={handleSimulate}>Run Simulation</button>
              <button className="btn btn-outline-secondary ms-2" onClick={() => setSelected([])}>Reset</button>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              {result ? (
                <>
                  <h5 className="mb-3">Simulation outcome</h5>
                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <small className="text-muted">Current</small>
                          <div className="fs-3 fw-bold text-primary">{currentCapability}%</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <small className="text-muted">Gain</small>
                          <div className="fs-3 fw-bold text-success">+{result.improvement}%</div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="card bg-light border-0 h-100">
                        <div className="card-body">
                          <small className="text-muted">Projected</small>
                          <div className="fs-3 fw-bold text-success">{result.improvedCapability}%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0056b3" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-3 alert alert-success mb-0">{result.message}</div>
                </>
              ) : (
                <div className="text-center text-muted py-5">
                  Select one or more actions and run a simulation to view restored capability.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIf;
