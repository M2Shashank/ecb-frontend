import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import AuthPage from './pages/AuthPage'
import { isAuthenticated } from './utils/auth'
import { getProducts } from './utils/productsApi'

function ProtectedCartRoute({ products }) {
  return isAuthenticated() ? <CartPage products={products} /> : <HomePage products={products} />
}

function AuthRoute() {
  return isAuthenticated() ? <Navigate to="/" replace /> : <AuthPage />
}

function AppContent({ products }) {
  const location = useLocation()

  return (
    <Routes>
      <Route path="/" element={<HomePage products={products} />} />
      <Route path="/cart" element={<ProtectedCartRoute products={products} />} />
      <Route path="/product/:productId" element={<ProductPage key={location.pathname} products={products} />} />
      <Route path="/auth" element={<AuthRoute />} />
    </Routes>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <BrowserRouter>
      {loading ? <p>Loading products...</p> : error ? <p role="alert">{error}</p> : <AppContent products={products} />}
    </BrowserRouter>
  )
}

export default App
