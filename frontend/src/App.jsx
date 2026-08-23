import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ScenarioSelect from './pages/ScenarioSelect';
import ResourceStatus from './pages/ResourceStatus';
import CapabilityView from './pages/CapabilityView';
import WhatIf from './pages/WhatIf';
import IntelligenceCenter from './pages/IntelligenceCenter';
import HomePage from './pages/HomePage';
import Login from './pages/Login';

function ProtectedLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-panel">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}

function ProtectedRoute() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { token } = useAuth();
  return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scenario" element={<ScenarioSelect />} />
          <Route path="/resources" element={<ResourceStatus />} />
          <Route path="/capability" element={<CapabilityView />} />
          <Route path="/whatif" element={<WhatIf />} />
          <Route path="/intelligence" element={<IntelligenceCenter />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
