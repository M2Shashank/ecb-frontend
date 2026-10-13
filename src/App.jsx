import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CartPage from './pages/CartPage'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import AuthPage from './pages/AuthPage'
import OrdersPage from './pages/OrdersPage'
import { isAuthenticated } from './utils/auth'
import { getProducts } from './utils/productsApi'

function ProtectedCartRoute({ products }) {
  return isAuthenticated() ? <CartPage products={products} /> : <HomePage products={products} />
}

function AuthRoute() {
  return isAuthenticated() ? <Navigate to="/" replace /> : <AuthPage />
}

function AppContent() {
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [loadedSearch, setLoadedSearch] = useState(null)
  const [error, setError] = useState('')
  const search = new URLSearchParams(location.search).get('search') || ''

  useEffect(() => {
    getProducts(search)
      .then((nextProducts) => {
        setProducts(nextProducts)
        setLoadedSearch(search)
        setError('')
      })
      .catch((requestError) => {
        setLoadedSearch(search)
        setError(requestError.message)
      })
  }, [search])

  const loading = loadedSearch !== search
  if (loading) return <p>Loading products...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <Routes>
      <Route path="/" element={<HomePage products={products} />} />
      <Route path="/cart" element={<ProtectedCartRoute products={products} />} />
      <Route path="/orders" element={isAuthenticated() ? <OrdersPage /> : <HomePage products={products} />} />
      <Route path="/product/:productId" element={<ProductPage key={location.pathname} products={products} />} />
      <Route path="/auth" element={<AuthRoute />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
