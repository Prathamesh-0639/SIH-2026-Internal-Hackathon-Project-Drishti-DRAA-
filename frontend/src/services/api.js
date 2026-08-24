import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('drishti-token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: 'Bearer ' + token,
    };
  }
  return config;
});

export const loginUser = (payload) => api.post('/auth/login', payload);
export const getUserProfile = () => api.get('/auth/me');
export const getScenarios = () => api.get('/scenarios');
export const getDatasetSummary = () => api.get('/datasets/summary');
export const getInsights = () => api.get('/insights');
export const getScenarioById = (scenarioId) => api.get(`/scenarios/${scenarioId}`);
export const getResources = (scenarioId) => api.get(`/resources/${scenarioId}`);
export const updateResource = (scenarioId, resourceType, payload) =>
  api.put(`/resources/${scenarioId}/${encodeURIComponent(resourceType)}`, payload);
export const getCapabilitySnapshot = (scenarioId) => api.get(`/capability/${scenarioId}`);
export const simulateActions = (payload) => api.post('/capability/simulate', payload);

export default api;
