import api from './api.js'

export async function getMe() {
  const { data } = await api.get('/me')
  return data
}

export async function updateMe(payload) {
  const { data } = await api.put('/me', payload)
  return data
}

export async function updatePassword(currentPassword, newPassword) {
  await api.put('/me/password', { current_password: currentPassword, new_password: newPassword })
}
