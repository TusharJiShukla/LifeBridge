const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Auth
  register: async (role, data) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, ...data }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Registration failed');
    return result;
  },

  login: async (email, password, role) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Login failed');
    return result;
  },

  // Donors
  getDonors: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/donors${query ? `?${query}` : ''}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch donors');
    return result;
  },

  getDonorById: async (id) => {
    const res = await fetch(`${API_BASE}/donors/${id}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch donor');
    return result;
  },

  updateDonorStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/donors/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update status');
    return result;
  },

  // Recipients
  getRecipients: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/recipients${query ? `?${query}` : ''}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch recipients');
    return result;
  },

  getRecipientById: async (id) => {
    const res = await fetch(`${API_BASE}/recipients/${id}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch recipient');
    return result;
  },

  updateRecipientStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/recipients/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update status');
    return result;
  },

  // Matching
  getMatchesForRecipient: async (recipientId) => {
    const res = await fetch(`${API_BASE}/matches/for-recipient/${recipientId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch matches');
    return result;
  },

  getMatchesForDonor: async (donorId) => {
    const res = await fetch(`${API_BASE}/matches/for-donor/${donorId}`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch matches');
    return result;
  },

  quickCheck: async (organ, bloodGroup, city) => {
    const res = await fetch(`${API_BASE}/matches/quick-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organ, bloodGroup, city }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to run matching check');
    return result;
  },

  getSummary: async () => {
    const res = await fetch(`${API_BASE}/matches/summary`);
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to fetch summary');
    return result;
  },
};
