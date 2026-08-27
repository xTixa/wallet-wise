import api from './api.js'

export async function listTransactions(params) {
  const { data } = await api.get('/transactions', { params })
  return data
}

export async function createTransaction(payload) {
  const { data } = await api.post('/transactions', payload)
  return data
}

export async function deleteTransaction(id) {
  await api.delete(`/transactions/${id}`)
}
