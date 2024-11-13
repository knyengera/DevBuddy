const API_BASE_URL = process.env.API_BASE_URL ?? "https://calmstack.azurewebsites.net/api";

async function loginUser(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Username: username,Password: password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

async function registerUser(username: string, email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Email: email, Password: password, Username: username }),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}


async function verifyToken(token: string) {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Token verification failed');
  }

  return response.json();
}

async function getQuests() {
  const response = await fetch(`${API_BASE_URL}/quests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quests');
  }

  return response.json();
}

export { loginUser, registerUser, verifyToken, getQuests }; 