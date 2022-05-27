const API_HOST = 'http://localhost:8080/api';

let _csrfToken = null;

async function getCsrfToken() {
  if (_csrfToken === null) {
    const response = await fetch(`${API_HOST}/msg/csrf`, {
      credentials: 'include',
    });
    const data = await response.json();
    _csrfToken = data.csrfToken;
  }
  return _csrfToken;
}

export async function clearCsrfToken() {
  _csrfToken = null;
}

export default getCsrfToken;