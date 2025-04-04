const API_URL = 'https://portalfin.in/api-login.php';

export const fetchData = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No authentication token');
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to fetch data');
  }

  return response.json();
};

// Specific API methods
export const getUserData = async () => {
  return fetchData('/user');
};

export const getProtectedData = async () => {
  return fetchData('/protected-data');
};