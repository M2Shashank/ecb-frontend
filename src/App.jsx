import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import AuthPage from './pages/AuthPage'
import { isAuthenticated } from './utils/auth'

function ProtectedCartRoute() {
  return isAuthenticated() ? <CartPage /> : <Navigate to="/auth" replace state={{ from: '/cart' }} />
}

function AuthRoute() {
  return isAuthenticated() ? <Navigate to="/" replace /> : <AuthPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<ProtectedCartRoute />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        <Route path="/auth" element={<AuthRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
