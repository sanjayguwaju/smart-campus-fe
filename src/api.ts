const API_BASE_URL = 'http://localhost:5000/api/v1';

export async function fetchPrograms(token?: string) {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch programs');
  return res.json();
}

// Add more API functions as needed. 