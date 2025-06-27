const API_BASE_URL = 'http://localhost:5000/api/v1';

export async function fetchPrograms(token?: string) {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('Failed to fetch programs');
  const response = await res.json();
  // Fix: Return the courses array from the nested data object
  if (Array.isArray(response.data?.courses)) return response.data.courses;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response)) return response;
  return [];
}

export async function createProgram(program: any, token: string) {
  const res = await fetch(`${API_BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(program),
  });
  if (!res.ok) throw new Error('Failed to create program');
  return res.json();
}

export async function updateProgram(id: string, program: any, token: string) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(program),
  });
  if (!res.ok) throw new Error('Failed to update program');
  return res.json();
}

export async function deleteProgram(id: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete program');
  return res.json();
}

export async function joinProgram(id: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/courses/${id}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to join program');
  return res.json();
}

export async function fetchFaculty(token: string) {
  const res = await fetch('http://localhost:5000/api/v1/users/role/faculty', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch faculty');
  return res.json();
}

// Add more API functions as needed. 