import api from './api.js'

export async function requestPasswordReset(email) {
  const { data } = await api.post('/password-reset/request', { email })
  return data
}

export async function resetPassword(token, newPassword) {
  await api.post('/password-reset/reset', { token, new_password: newPassword })
}
