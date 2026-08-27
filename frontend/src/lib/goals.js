import api from './api.js'

export async function listGoals() {
  const { data } = await api.get('/goals')
  return data
}

export async function createGoal(payload) {
  const { data } = await api.post('/goals', payload)
  return data
}

export async function contributeToGoal(id, amount) {
  const { data } = await api.post(`/goals/${id}/contribute`, { amount })
  return data
}

export async function deleteGoal(id) {
  await api.delete(`/goals/${id}`)
}
