import api from './api.js'

export async function listAccounts() {
  const { data } = await api.get('/accounts')
  return data
}

export async function createAccount(payload) {
  const { data } = await api.post('/accounts', payload)
  return data
}
