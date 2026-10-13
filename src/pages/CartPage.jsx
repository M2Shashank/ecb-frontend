import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductShelf from '../components/ProductShelf'
import { products } from '../../data/products.js'
import { cart as defaultCart } from '../../data/cart.js'
import { asset } from '../utils/assets'
import './CartPage.css'

function readCart() {
  try {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : defaultCart
  } catch {
    return defaultCart
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function CartPage() {
  const [cart, setCart] = useState(readCart)
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => {
    const product = products.find(({ sku }) => sku === item.cartItemSku)
    return total + (product ? item.quantity * product.afterPriceRs : 0)
  }, 0)

  const updateQuantity = (cartItem, change) => {
    const nextCart = cart.flatMap((item) => {
      if (item.cartItemSku !== cartItem.cartItemSku || item.size !== cartItem.size) return [item]
      const quantity = item.quantity + change
      return quantity > 0 ? [{ ...item, quantity }] : []
    })
    setCart(nextCart)
    saveCart(nextCart)
  }

  const addToCart = (product) => {
    const size = product.availableSizes[0]
    const nextCart = [...cart]
    const existingItem = nextCart.find((item) => item.cartItemSku === product.sku && item.size === size)
    if (existingItem) existingItem.quantity += 1
    else nextCart.push({ cartItemSku: product.sku, quantity: 1, size })
    setCart(nextCart)
    saveCart(nextCart)
  }

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
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty.</p>
            ) : cart.map((cartItem) => {
              const product = products.find(({ sku }) => sku === cartItem.cartItemSku)
              if (!product) return null
              return (
                <article className="cart-item" key={`${cartItem.cartItemSku}-${cartItem.size}`}>
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
                      <button type="button" onClick={() => updateQuantity(cartItem, -1)} aria-label={`Remove one ${product.name}`}>−</button>
                      <span>{cartItem.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(cartItem, 1)} aria-label={`Add one ${product.name}`}>+</button>
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
                <span className="cart-subtotal-amount">₹ {subtotal.toFixed(2)}</span>
              </div>
              <div className="other-information">Shipping, taxes, and discount codes calculated at checkout</div>
              <button className="checkout-button" type="button">Check out</button>
            </div>
          </div>
        </section>

        <ProductShelf onAddToCart={addToCart} />
      </main>
      <Footer />
    </div>
  )
}

export default CartPage
