// src/utils/auth.js
export const setSession = (token, user) => {
  localStorage.setItem('auth_token', token)
  localStorage.setItem('auth_user', JSON.stringify(user))
}

export const getSession = () => {
  const token = localStorage.getItem('auth_token')
  const user = localStorage.getItem('auth_user')
  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: Boolean(token)
  }
}

export const clearSession = () => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('auth_user')
}