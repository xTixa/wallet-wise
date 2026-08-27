import api from './api.js'

export async function listRecurringExpenses() {
  const { data } = await api.get('/recurring-expenses')
  return data
}

export async function createRecurringExpense(payload) {
  const { data } = await api.post('/recurring-expenses', payload)
  return data
}

export async function confirmRecurringExpensePayment(id) {
  const { data } = await api.post(`/recurring-expenses/${id}/confirm`)
  return data
}

export async function deleteRecurringExpense(id) {
  await api.delete(`/recurring-expenses/${id}`)
}
