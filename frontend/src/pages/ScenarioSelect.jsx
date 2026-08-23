import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenarioProfile, setStoredScenario } from '../data/scenarioProfile';

const ScenarioSelect = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('drishti-scenario') || '{}');
      return {
        district: stored.district || 'Kolhapur',
        disasterType: stored.disasterType || 'Flood',
        severity: stored.severity || 'High',
      };
    } catch {
      return { district: 'Kolhapur', disasterType: 'Flood', severity: 'High' };
    }
  });
  const [message, setMessage] = useState('');

  const profile = getScenarioProfile(form);

  useEffect(() => {
    setStoredScenario(profile);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setStoredScenario(profile);
    setMessage('Scenario loaded successfully. Resource status and capability views now reflect the selected district profile.');
    setTimeout(() => navigate('/resources'), 600);
  };

  return (
    <div className="page-shell p-4">
      <div className="card shadow-sm border-0 mx-auto" style={{ maxWidth: 860 }}>
        <div className="card-body p-4">
          <h3 className="mb-4">Select Scenario</h3>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">District</label>
                <select className="form-select" name="district" value={form.district} onChange={handleChange}>
                  <option>Kolhapur</option>
                  <option>Pune</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Disaster Type</label>
                <select className="form-select" name="disasterType" value={form.disasterType} onChange={handleChange}>
                  <option>Flood</option>
                  <option>Landslide</option>
                  <option>Cyclone</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Severity</label>
                <select className="form-select" name="severity" value={form.severity} onChange={handleChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="alert alert-light border mt-4 mb-0">
              <strong>{profile.district}</strong> · {profile.disasterType} · {profile.severity} severity
              <div className="mt-2 text-muted">Estimated effective capability: {profile.capability}%</div>
            </div>
            <button type="submit" className="btn btn-primary mt-4">Load Scenario</button>
          </form>
          {message && <div className="alert alert-success mt-4 mb-0">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelect;
