export const SERVER_URL = 'http://localhost:4001'
export const API_BASE_URL = `${SERVER_URL}/api`

export function getAuthHeader() {
  const token = localStorage.getItem('_auth')
  return { 'Authorization': `Bearer ${token}`}
}