import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProductCard.css'
import { asset } from '../utils/assets'
import { isAuthenticated } from '../utils/auth'
import { addToWishlist, removeFromWishlist } from '../utils/wishlistApi'

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate()
  const [imageIndex, setImageIndex] = useState(0)
  const [wishlisted, setWishlisted] = useState(product.inWishlist)
  const [cartStatus, setCartStatus] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const discount = Math.round(((product.priceRs - product.afterPriceRs) / product.priceRs) * 100)
  const productId = product.backendId || product._id

  const handleAddToCart = async (event) => {
    event.stopPropagation()
    if (!isAuthenticated()) {
      window.alert('Please log in to add items to your cart.')
      return
    }
    setAddingToCart(true)
    setCartStatus('')
    try {
      await onAddToCart(product)
      setCartStatus('ADDED')
    } catch (error) {
      setCartStatus(error.message)
    } finally {
      setAddingToCart(false)
    }
  }

  return (
    <article className="product-card" data-product-id={productId}>
      <div className="product-img-wrapper">
        <div className="img-relative-wrapper" onClick={() => navigate(`/product/${productId}`)} onKeyDown={(event) => event.key === 'Enter' && navigate(`/product/${productId}`)} role="link" tabIndex={0}>
          <div className="product-images-wrapper" style={{ transform: `translateX(-${imageIndex * 100}%)` }}>
            {product.images.map((image) => (
              <img className="product-img" src={image} alt={product.name} key={image} />
            ))}
          </div>
          <button className="addtocart-button" type="button" disabled={addingToCart} onClick={handleAddToCart}>{addingToCart ? 'ADDING...' : cartStatus === 'ADDED' ? 'ADDED' : 'ADD TO CART'}</button>
          <button className="scroll-right-button" type="button" aria-label="Next product image" onClick={(event) => { event.stopPropagation(); setImageIndex(Math.min(product.images.length - 1, imageIndex + 1)) }}>›</button>
          <button className="scroll-left-button" type="button" aria-label="Previous product image" onClick={(event) => { event.stopPropagation(); setImageIndex(Math.max(0, imageIndex - 1)) }}>‹</button>
        </div>
        {cartStatus && cartStatus !== 'ADDED' && <span className="cart-status-error" role="alert">{cartStatus}</span>}
      </div>
      <button className="wishlist-icon" type="button" onClick={() => {
        if (!isAuthenticated()) {
          window.alert('Please log in to manage your wishlist.')
          return
        }
        const nextWishlisted = !wishlisted
        const request = nextWishlisted ? addToWishlist : removeFromWishlist
        request(productId)
          .then(() => setWishlisted(nextWishlisted))
          .catch((error) => setCartStatus(error.message))
      }} aria-label="Toggle wishlist">
        <img className="heart-icon" src={asset(`assets/main-assets/${wishlisted ? 'heartFilled_icon.svg' : 'heartEmpty_icon.svg'}`)} alt="" />
      </button>
      <span className="discount-alert">SAVE {discount}%</span>
      <div className="product-name">{product.name.toUpperCase()}</div>
      <div className="product-price">
        <del className="original-price">Rs.{product.priceRs.toFixed(2)}</del>
        <ins className="discounted-price">Rs.{product.afterPriceRs}</ins>
      </div>
    </article>
  )
}

export default ProductCard
