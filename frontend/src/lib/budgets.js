import api from './api.js'

export async function listBudgets(params) {
  const { data } = await api.get('/budgets', { params })
  return data
}

export async function createBudget(payload) {
  const { data } = await api.post('/budgets', payload)
  return data
}

export async function deleteBudget(id) {
  await api.delete(`/budgets/${id}`)
}
