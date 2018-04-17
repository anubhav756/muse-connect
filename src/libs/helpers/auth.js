export function isTokenUnavailable() {
  const token = localStorage.getItem('access_token')
  const tokenExpired = new Date().getTime() >= JSON.parse(localStorage.getItem('expires_at'))
  return (!token || token === 'null' || tokenExpired)
}

export default {
  isTokenUnavailable
}
