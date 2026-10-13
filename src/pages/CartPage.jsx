import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductShelf from '../components/ProductShelf'
import { asset } from '../utils/assets'
import { addCartItem, getCart, updateCartItem } from '../utils/cartApi'
import { createOrder } from '../utils/orderApi'
import './CartPage.css'

function CartPage({ products }) {
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], totalCost: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingItemId, setUpdatingItemId] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)

  useEffect(() => {
    let mounted = true
    getCart()
      .then((nextCart) => {
        if (mounted) setCart(nextCart)
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

  const handleQuantityChange = async (cartItem, change) => {
    const nextQuantity = cartItem.quantity + change
    try {
      setUpdatingItemId(cartItem._id)
      setError('')
      setCart(await updateCartItem(cartItem._id, nextQuantity))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUpdatingItemId('')
    }
  }

  const addToCart = async (product) => {
    try {
      setError('')
      setCart(await addCartItem(product, product.availableSizes[0]))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const placeOrder = async () => {
    try {
      setPlacingOrder(true)
      setError('')
      await createOrder()
      navigate('/orders')
    } catch (requestError) {
      setError(requestError.message)
      setPlacingOrder(false)
    }
  }

  const cartQuantity = cart.items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="cart-page">
      <Header cartQuantity={cartQuantity} />
      <main className="cart-main-container">
        <div className="cart-heading">
          <h1 className="cart-title">Cart</h1>
          <Link className="homepage-link" to="/">Continue Shopping</Link>
        </div>

        <section className="cart-items-table" aria-label="Shopping cart">
          <div className="columns-description">
            <span className="item-quantity-heading">QUANTITY</span>
            <span className="item-cost-heading">TOTAL</span>
          </div>
          <div className="cart-items-content">
            {loading && <p className="empty-cart">Loading your cart...</p>}
            {!loading && error && <p className="empty-cart" role="alert">{error}</p>}
            {!loading && !error && cart.items.length === 0 && (
              <p className="empty-cart">Your cart is empty.</p>
            )}
            {!loading && !error && cart.items.map((cartItem) => {
              const product = cartItem.product
              if (!product) return null
              const itemUpdating = updatingItemId === cartItem._id
              return (
                <article className="cart-item" key={cartItem._id}>
                  <div className="item-description">
                    <div className="item-image-container">
                      <img className="item-image" src={asset(product.images[0])} alt={product.name} />
                    </div>
                    <div className="item-details">
                      <span className="item-name">{product.name}</span>
                      <span><strong>GENDER:</strong> {product.gender}</span>
                      <span><strong>SIZE:</strong> {cartItem.size}</span>
                    </div>
                  </div>
                  <div className="item-quantity-box">
                    <div className="item-quantity-div">
                      <button type="button" disabled={itemUpdating} onClick={() => handleQuantityChange(cartItem, -1)} aria-label={`Remove one ${product.name}`}>−</button>
                      <span>{cartItem.quantity}</span>
                      <button type="button" disabled={itemUpdating} onClick={() => handleQuantityChange(cartItem, 1)} aria-label={`Add one ${product.name}`}>+</button>
                    </div>
                  </div>
                  <div className="item-total-price">₹{(cartItem.quantity * product.afterPriceRs).toFixed(2)}</div>
                </article>
              )
            })}
          </div>
          <div className="cart-table-final-row">
            <div className="checkout-container">
              <div className="subtotal-container">
                <strong className="cart-subtotal-title">SUBTOTAL</strong>
                <span className="cart-subtotal-amount">₹ {Number(cart.totalCost).toFixed(2)}</span>
              </div>
              <div className="other-information">Shipping, taxes, and discount codes calculated at checkout</div>
              <button className="checkout-button" type="button" disabled={placingOrder || cart.items.length === 0} onClick={placeOrder}>
                {placingOrder ? 'PLACING ORDER...' : 'PLACE ORDER'}
              </button>
            </div>
          </div>
        </section>

        <ProductShelf products={products} onAddToCart={addToCart} />
      </main>
      <Footer />
    </div>
  )
}

export default CartPage
