export const API_HOST = process.env.API_HOST || "https://localhost:8080/api";

let _csrfToken = null;
/**
 * This function is responsible for getting the CSRF token.
 * @returns A promise that resolves to the CSRF token.
 */
async function getCsrfToken() {
  if (_csrfToken === null) {
    const response = await fetch(`${API_HOST}/msg/csrf`, {
      credentials: "include",
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
