import { useEffect, useMemo, useState } from 'react';
import { getStoredScenario, getScenarioProfile } from '../data/scenarioProfile';

const statusClass = {
  Available: 'success',
  Maintenance: 'warning',
  Unavailable: 'danger',
  Blocked: 'danger',
  'Operator Missing': 'secondary',
};

const ResourceStatus = () => {
  const [selectedScenario, setSelectedScenario] = useState(() => getStoredScenario());
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ availableQty: '', currentStatus: 'Available', notes: '' });

  useEffect(() => {
    const stored = getStoredScenario();
    setSelectedScenario(stored);
  }, []);

  const resources = useMemo(
    () => selectedScenario?.resources || getScenarioProfile(selectedScenario).resources,
    [selectedScenario]
  );

  const openEditor = (resource) => {
    setSelected(resource);
    setForm({
      availableQty: resource.availableQty,
      currentStatus: resource.currentStatus,
      notes: resource.notes,
    });
  };

  const handleUpdate = () => {
    if (!selected) return;

    const updated = resources.map((resource) =>
      resource.type === selected.type
        ? {
            ...resource,
            availableQty: Number(form.availableQty),
            currentStatus: form.currentStatus,
            notes: form.notes,
            lastUpdated: new Date().toISOString(),
          }
        : resource
    );

    const updatedScenario = {
      ...selectedScenario,
      resources: updated,
      summary: {
        planned: updated.reduce((sum, item) => sum + item.plannedQty, 0),
        available: updated.reduce((sum, item) => sum + item.availableQty, 0),
        capability: Math.round(
          (updated.reduce((sum, item) => sum + item.availableQty, 0) /
            updated.reduce((sum, item) => sum + item.plannedQty, 0)) *
            100
        ),
        criticalGaps: updated.filter((item) => item.availableQty < item.plannedQty).length,
      },
    };

    localStorage.setItem('drishti-scenario', JSON.stringify(updatedScenario));
    window.dispatchEvent(new CustomEvent('drishti-scenario-updated', { detail: updatedScenario }));
    setSelectedScenario(updatedScenario);
    setSelected(null);
  };

  return (
    <div className="page-shell p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Resource Status</h3>
        <span className="badge text-bg-primary">{selectedScenario.district} · {selectedScenario.disasterType} · {selectedScenario.severity}</span>
      </div>

      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Resource Type</th>
                <th>Planned</th>
                <th>Available</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <tr key={resource.type}>
                  <td>{resource.type}</td>
                  <td>{resource.plannedQty}</td>
                  <td>{resource.availableQty}</td>
                  <td>
                    <span className={`badge text-bg-${statusClass[resource.currentStatus] || 'secondary'}`}>
                      {resource.currentStatus}
                    </span>
                  </td>
                  <td>{new Date(resource.lastUpdated).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openEditor(resource)}>Update Status</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="modal d-block bg-dark bg-opacity-25" style={{ position: 'fixed', inset: 0 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update {selected.type}</h5>
                <button className="btn-close" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Available Qty</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.availableQty}
                    onChange={(e) => setForm({ ...form, availableQty: Number(e.target.value) })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Status</label>
                  <select
                    className="form-select"
                    value={form.currentStatus}
                    onChange={(e) => setForm({ ...form, currentStatus: e.target.value })}
                  >
                    <option>Available</option>
                    <option>Maintenance</option>
                    <option>Unavailable</option>
                    <option>Blocked</option>
                    <option>Operator Missing</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceStatus;
