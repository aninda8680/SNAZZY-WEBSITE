import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 15000,
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('snazzy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear bad token and redirect to login
// Skip redirect when already on auth pages (login/register) to avoid redirect loops
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const onAuthPage = window.location.pathname.startsWith('/login') ||
                       window.location.pathname.startsWith('/register')
    if (err.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem('snazzy_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
