import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getOrders } from '../utils/orderApi'
import './OrdersPage.css'

function getProgress(order, now) {
  const start = Number(order.orderTimeMs)
  const end = Number(order.estimatedDeliveryTimeMS)
  if (!start || !end || end <= start) return 0
  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
}

function getStatus(progress) {
  if (progress >= 100) return 'ORDER FULFILLED'
  if (progress >= 50) return 'ORDER DISPATCHED'
  return 'PREPARING ORDER'
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [now, setNow] = useState(() => Date.now())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getOrders()
      .then((nextOrders) => {
        if (mounted) setOrders(nextOrders.sort((a, b) => Number(b.orderTimeMs || 0) - Number(a.orderTimeMs || 0)))
      })
      .catch((requestError) => {
        if (mounted) setError(requestError.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="orders-page">
      <Header cartQuantity={0} />
      <main className="orders-main">
        <div className="orders-heading">
          <h1>Orders</h1>
          <Link to="/">Continue Shopping</Link>
        </div>
        {loading && <p className="orders-message">Loading orders...</p>}
        {!loading && error && <p className="orders-message" role="alert">{error}</p>}
        {!loading && !error && !orders.length && <p className="orders-message">You have not placed any orders yet.</p>}
        <div className="orders-list">
          {orders.map((order) => {
            const progress = getProgress(order, now)
            return (
              <article className="order-card" key={order._id}>
                <div className="order-card-header">
                  <strong>ORDER #{order._id}</strong>
                  <span>₹ {Number(order.totalCost || 0).toFixed(2)}</span>
                </div>
                <div className="order-items">
                  {order.orderItems.map((item, index) => (
                    <div className="order-item" key={item._id || `${item.product?._id || item.product}-${index}`}>
                      {item.product?.images?.[0] && (
                        <img
                          className="order-item-image"
                          src={item.product.images[0]}
                          alt={item.product.name}
                        />
                      )}
                      <div className="order-item-details">
                        <strong>{item.product?.name || `Product ${item.product}`}</strong>
                        <span>SIZE: {item.size}</span>
                        <span>QUANTITY: {item.quantity}</span>
                      </div>
                      <span className="order-item-cost">
                        ₹ {(Number(item.product?.afterPriceRs || item.product?.priceRs || 0) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-tracking">
                  <div className="tracking-heading">
                    <strong>TRACKING</strong>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="order-progress">
                    <div className="order-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="order-status">{getStatus(progress)}</div>
                </div>
              </article>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default OrdersPage
