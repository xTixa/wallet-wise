import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import RecoverPassword from './pages/Auth/RecoverPassword.jsx'
import ResetPassword from './pages/Auth/ResetPassword.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Revenues from './pages/Management/Revenues/Revenues.jsx'
import Expenses from './pages/Management/Expenses/Expenses.jsx'
import RecurringExpenses from './pages/Management/RecurringExpenses/RecurringExpenses.jsx'
import Categories from './pages/Categories/Categories.jsx'
import Budget from './pages/Budget/Budget.jsx'
import Goals from './pages/Goals/Goals.jsx'
import Search from './pages/Search/Search.jsx'
import Statistics from './pages/Statistics/Statistics.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'

function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registar" element={<Register />} />
        <Route path="/recuperar-password" element={<RecoverPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/receitas" element={<Revenues />} />
          <Route path="/despesas" element={<Expenses />} />
          <Route path="/despesas-recorrentes" element={<RecurringExpenses />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/orcamento" element={<Budget />} />
          <Route path="/objetivos" element={<Goals />} />
          <Route path="/pesquisa" element={<Search />} />
          <Route path="/estatisticas" element={<Statistics />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/definicoes" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
