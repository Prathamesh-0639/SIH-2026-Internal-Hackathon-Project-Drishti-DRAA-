import { useEffect, useState } from 'react';
import { getInsights } from '../services/api';
import { readCache, writeCache } from '../services/cache';
import { getScenarioProfile, getStoredScenario } from '../data/scenarioProfile';

const INTELLIGENCE_CACHE_KEY = 'drishti-intelligence-cache';

const getScenarioRiskIndex = (selectedScenario) => {
  const capability = Number(selectedScenario?.capability ?? 67) || 67;
  const severityBonus = selectedScenario?.severity === 'High' ? 18 : selectedScenario?.severity === 'Medium' ? 10 : 5;
  const disasterBonus = selectedScenario?.disasterType === 'Cyclone' ? 7 : selectedScenario?.disasterType === 'Landslide' ? 4 : 2;
  return Math.min(100, Math.max(0, Math.round(100 - capability + severityBonus + disasterBonus)));
};

const IntelligenceCenter = () => {
  const [selectedScenario, setSelectedScenario] = useState(() => getStoredScenario());
  const [data, setData] = useState(() => readCache(INTELLIGENCE_CACHE_KEY) || null);
  const [loading, setLoading] = useState(() => !readCache(INTELLIGENCE_CACHE_KEY));

  useEffect(() => {
    const syncScenario = () => {
      setSelectedScenario(getStoredScenario());
    };
    syncScenario();

    const onScenarioUpdate = () => syncScenario();
    window.addEventListener('drishti-scenario-updated', onScenarioUpdate);
    window.addEventListener('storage', onScenarioUpdate);

    const cached = readCache(INTELLIGENCE_CACHE_KEY);
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    const load = async () => {
      try {
        const response = await getInsights();
        setData(response.data);
        writeCache(INTELLIGENCE_CACHE_KEY, response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      window.removeEventListener('drishti-scenario-updated', onScenarioUpdate);
      window.removeEventListener('storage', onScenarioUpdate);
    };
  }, []);

  if (loading) {
    return <div className="page-shell p-4">Loading intelligence centre...</div>;
  }

  const activeScenario = selectedScenario && selectedScenario.district && selectedScenario.disasterType && selectedScenario.severity
    ? getScenarioProfile({
        district: selectedScenario.district,
        disasterType: selectedScenario.disasterType,
        severity: selectedScenario.severity,
      })
    : getStoredScenario();

  const risk = getScenarioRiskIndex(activeScenario) ?? data?.riskIndex ?? 82;
  const districtScenarioSummary = (() => {
    const base = data?.summary || { floodEvents: 0, disasterEvents: 0, lightningEvents: 0, affectedState: 'Kerala', affectedStateEvents: 0 };
    const districtFactor = activeScenario?.district === 'Pune' ? 0.38 : 0.32;
    const severityFactor = activeScenario?.severity === 'High' ? 1.3 : activeScenario?.severity === 'Medium' ? 1.1 : 0.9;
    const disasterFactor = activeScenario?.disasterType === 'Flood' ? 1.15 : activeScenario?.disasterType === 'Landslide' ? 0.9 : 1.05;

    return {
      floodEvents: Math.max(1, Math.round((base.floodEvents || 0) * districtFactor * severityFactor * disasterFactor)),
      disasterEvents: Math.max(1, Math.round((base.disasterEvents || 0) * districtFactor * (activeScenario?.severity === 'High' ? 0.9 : 0.7))),
      lightningEvents: Math.max(1, Math.round((base.lightningEvents || 0) * 0.00014 * severityFactor * (activeScenario?.district === 'Pune' ? 1.25 : 1))),
      affectedState: activeScenario?.district || base.affectedState
    };
  })();
  const summary = activeScenario?.summary ? {
    ...data?.summary,
    floodEvents: districtScenarioSummary.floodEvents,
    disasterEvents: districtScenarioSummary.disasterEvents,
    lightningEvents: districtScenarioSummary.lightningEvents,
    affectedState: districtScenarioSummary.affectedState,
  } : data?.summary || {};
  const recommendations = (activeScenario?.actions || []).map((action, index) => ({
    title: action.actionName,
    detail: `${action.relatedResourceType} · Expected recovery ${action.expectedRecovery}%`,
    priority: index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low',
  })) || data?.recommendations || [];
  const hotspots = activeScenario ? [
    { label: activeScenario.district, value: `${activeScenario.severity} risk` },
    { label: activeScenario.disasterType, value: `${activeScenario.capability}% readiness` },
    { label: 'Resource strain', value: `${Math.max(1, Math.round(100 - activeScenario.capability))}%` }
  ] : data?.hotspots || [];

  return (
    <div className="page-shell p-4">
      <div className="hero-panel mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="tag">Live Risk Intelligence</div>
            <h2>District risk profile is trending at {risk}/100</h2>
            <p className="mb-0 text-white-50">
              Based on current flood, disaster, and lightning event aggregation across India, combined with district-level operational readiness.
            </p>
            <div className="cta-row">
              <button className="btn btn-light text-primary fw-semibold" onClick={() => window.location.href = '/scenario'}>Open scenario planner</button>
              <button className="btn btn-outline-light" onClick={() => window.location.href = '/dashboard'}>Open dashboard</button>
            </div>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <div className="hero-mini">
              <div className="label">Risk index</div>
              <div className="score">{risk}</div>
              <div className="small text-white-50">Focus on flood-prone districts and communication resilience.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card analysis-card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small">Flood Events</div>
              <h4 className="mt-2 mb-0">{summary.floodEvents?.toLocaleString() || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analysis-card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small">Disaster Events</div>
              <h4 className="mt-2 mb-0">{summary.disasterEvents?.toLocaleString() || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analysis-card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small">Lightning Events</div>
              <h4 className="mt-2 mb-0">{summary.lightningEvents?.toLocaleString() || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card analysis-card shadow-sm border-0 h-100">
            <div className="card-body">
              <div className="text-muted small">Top State</div>
              <h4 className="mt-2 mb-0">{summary.affectedState || 'Kerala'}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Recommended response actions</h5>
              <ul className="smart-list">
                {recommendations.map((item) => (
                  <li key={item.title}>
                    <span className={`priority-dot priority-${item.priority.toLowerCase()}`} />
                    <strong>{item.title}</strong>
                    <div className="text-muted small mt-1">{item.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h5 className="mb-3">Hotspot watchlist</h5>
              <ul className="smart-list">
                {hotspots.map((hotspot) => (
                  <li key={hotspot.label}>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong>{hotspot.label}</strong>
                      <span className="badge text-bg-light text-dark">{hotspot.value}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligenceCenter;
