import { useEffect, useState } from 'react';
import { getDatasetSummary, getInsights, getScenarioById, getScenarios } from '../services/api';
import { readCache, writeCache } from '../services/cache';
import { getScenarioProfile, getStoredScenario } from '../data/scenarioProfile';
import CapabilityCard from '../components/CapabilityCard';
import Charts from '../components/Charts';
import PriorityTable from '../components/PriorityTable';

const DASHBOARD_CACHE_KEY = 'drishti-dashboard-cache';

const getScenarioRiskIndex = (selectedScenario) => {
  const capability = Number(selectedScenario?.capability ?? 67) || 67;
  const severityBonus = selectedScenario?.severity === 'High' ? 18 : selectedScenario?.severity === 'Medium' ? 10 : 5;
  const disasterBonus = selectedScenario?.disasterType === 'Cyclone' ? 7 : selectedScenario?.disasterType === 'Landslide' ? 4 : 2;
  return Math.min(100, Math.max(0, Math.round(100 - capability + severityBonus + disasterBonus)));
};

const Dashboard = () => {
  const [selectedScenario, setSelectedScenario] = useState(() => getStoredScenario());
  const [scenarios, setScenarios] = useState(() => {
    const cached = readCache(DASHBOARD_CACHE_KEY);
    return cached?.scenarios || [];
  });
  const [scenarioData, setScenarioData] = useState(() => readCache(DASHBOARD_CACHE_KEY)?.scenarioData || null);
  const [realData, setRealData] = useState(() => readCache(DASHBOARD_CACHE_KEY)?.realData || null);
  const [insights, setInsights] = useState(() => readCache(DASHBOARD_CACHE_KEY)?.insights || null);
  const [loading, setLoading] = useState(() => !readCache(DASHBOARD_CACHE_KEY));

  useEffect(() => {
    const syncScenario = () => {
      const current = getStoredScenario();
      setSelectedScenario(current);
    };
    syncScenario();

    const onScenarioUpdate = () => syncScenario();
    window.addEventListener('drishti-scenario-updated', onScenarioUpdate);
    window.addEventListener('storage', onScenarioUpdate);

    const cached = readCache(DASHBOARD_CACHE_KEY);
    if (cached) {
      setScenarios(cached.scenarios || []);
      setScenarioData(cached.scenarioData || null);
      setRealData(cached.realData || null);
      setInsights(cached.insights || null);
      setLoading(false);
    }

    const loadData = async () => {
      try {
        const [scenarioResponse, datasetResponse, insightResponse] = await Promise.all([
          getScenarios(),
          getDatasetSummary(),
          getInsights(),
        ]);

        let detailData = null;
        const primaryScenario = scenarioResponse.data.scenarios[0];
        if (primaryScenario) {
          try {
            const detail = await getScenarioById(primaryScenario.scenarioId);
            detailData = detail.data;
          } catch {
            detailData = null;
          }
        }

        const nextPayload = {
          scenarios: scenarioResponse.data.scenarios,
          scenarioData: detailData,
          realData: datasetResponse.data,
          insights: insightResponse.data,
        };

        setScenarios(nextPayload.scenarios);
        setScenarioData(detailData);
        setRealData(nextPayload.realData);
        setInsights(nextPayload.insights);
        writeCache(DASHBOARD_CACHE_KEY, nextPayload);
      } catch (error) {
        console.error('Dashboard data failed', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => {
      window.removeEventListener('drishti-scenario-updated', onScenarioUpdate);
      window.removeEventListener('storage', onScenarioUpdate);
    };
  }, []);

  if (loading) {
    return <div className="page-shell p-4">Loading dashboard...</div>;
  }

  const activeScenario = selectedScenario && selectedScenario.district && selectedScenario.disasterType && selectedScenario.severity
    ? getScenarioProfile({
        district: selectedScenario.district,
        disasterType: selectedScenario.disasterType,
        severity: selectedScenario.severity,
      })
    : getStoredScenario();

  const summary = activeScenario?.summary || scenarioData?.summary || { planned: 144, available: 127, capability: 67, criticalGaps: 3 };
  const chartResources = activeScenario?.resources || scenarioData?.resources || [];
  const topActions = activeScenario?.actions || scenarioData?.actions || [];
  const riskIndex = getScenarioRiskIndex(activeScenario) ?? insights?.riskIndex ?? 82;

  const districtScenarioSummary = (() => {
    const base = realData || { floodEvents: 0, disasterEvents: 0, lightningEvents: 0, affectedState: 'Kerala', affectedStateEvents: 0 };
    const districtFactor = activeScenario?.district === 'Pune' ? 0.38 : 0.32;
    const severityFactor = activeScenario?.severity === 'High' ? 1.3 : activeScenario?.severity === 'Medium' ? 1.1 : 0.9;
    const disasterFactor = activeScenario?.disasterType === 'Flood' ? 1.15 : activeScenario?.disasterType === 'Landslide' ? 0.9 : 1.05;

    return {
      floodEvents: Math.max(1, Math.round((base.floodEvents || 0) * districtFactor * severityFactor * disasterFactor)),
      disasterEvents: Math.max(1, Math.round((base.disasterEvents || 0) * districtFactor * (activeScenario?.severity === 'High' ? 0.9 : 0.7))),
      lightningEvents: Math.max(1, Math.round((base.lightningEvents || 0) * 0.00014 * severityFactor * (activeScenario?.district === 'Pune' ? 1.25 : 1))),
      affectedState: activeScenario?.district || base.affectedState,
      affectedStateEvents: Math.max(1, Math.round((base.affectedStateEvents || 0) * severityFactor)),
    };
  })();

  const cards = realData
    ? [
        { title: 'Flood Events', value: districtScenarioSummary.floodEvents.toLocaleString(), hint: `${activeScenario?.district || 'District'} flood inventory`, accent: 'danger' },
        { title: 'Disaster Events', value: districtScenarioSummary.disasterEvents.toLocaleString(), hint: `${activeScenario?.disasterType || 'Active'} event profile`, accent: 'primary' },
        { title: 'Lightning Events', value: districtScenarioSummary.lightningEvents.toLocaleString(), hint: 'District lightning risk dataset', accent: 'warning' },
        { title: 'Top State', value: districtScenarioSummary.affectedState, hint: `${districtScenarioSummary.affectedStateEvents} event clusters`, accent: 'success' },
      ]
    : [
        { title: 'Effective Capability', value: `${summary.capability}%`, hint: 'Planned vs actual', accent: 'danger' },
        { title: 'Total Planned', value: summary.planned, hint: 'Resource units', accent: 'primary' },
        { title: 'Currently Available', value: summary.available, hint: 'Operationally ready', accent: 'success' },
        { title: 'Critical Gaps', value: summary.criticalGaps, hint: 'Resource shortfalls', accent: 'warning' },
      ];

  return (
    <div className="page-shell p-4">
      <div className="hero-panel mb-4">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <div className="tag">Command Overview</div>
            <h2>Operational response index: {riskIndex}/100</h2>
            <p className="mb-0 text-white-50">
              Real disaster data and scenario readiness are combined into a single decision-support view for flood and response planning.
            </p>
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <div className="hero-mini">
              <div className="label">Current capability</div>
              <div className="score">{summary.capability}%</div>
              <div className="small text-white-50">{summary.criticalGaps} critical gaps detected across active resources.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Operational Readiness Overview</h3>
          <small className="text-muted">Scenario-driven assessment of operational readiness and deployable disaster response capability.</small>
        </div>
        <span className="badge text-bg-secondary">Real datasets + simulated operational model</span>
      </div>

      <div className="row g-4 mb-4">
        {cards.map((card) => (
          <div className="col-md-3" key={card.title}>
            <CapabilityCard title={card.title} value={card.value} hint={card.hint} accent={card.accent} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <Charts resources={chartResources} />
        </div>
        <div className="col-lg-4">
          <PriorityTable actions={topActions.slice(0, 5)} />
        </div>
      </div>

      <div className="alert alert-light border mt-3 mb-0">
        Real dataset note: India flood inventory, disaster inventory, and lightning event records inform this dashboard; operational readiness remains a simulated assurance layer for rapid decision-making.
      </div>
    </div>
  );
};

export default Dashboard;
