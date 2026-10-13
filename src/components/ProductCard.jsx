import { useState } from 'react'
import './ProductCard.css'
import { asset } from '../utils/assets'

function ProductCard({ product, onAddToCart }) {
  const [imageIndex, setImageIndex] = useState(0)
  const [wishlisted, setWishlisted] = useState(product.inWishlist)
  const discount = Math.round(((product.priceRs - product.afterPriceRs) / product.priceRs) * 100)

  return (
    <article className="product-card">
      <div className="product-img-wrapper">
        <div className="img-relative-wrapper">
          <div className="product-images-wrapper" style={{ transform: `translateX(-${imageIndex * 100}%)` }}>
            {product.images.map((image) => (
              <img className="product-img" src={asset(image)} alt={product.name} key={image} />
            ))}
          </div>
          <button className="addtocart-button" type="button" onClick={() => onAddToCart(product)}>ADD TO CART</button>
          <button className="scroll-right-button" type="button" aria-label="Next product image" onClick={() => setImageIndex(Math.min(product.images.length - 1, imageIndex + 1))}>›</button>
          <button className="scroll-left-button" type="button" aria-label="Previous product image" onClick={() => setImageIndex(Math.max(0, imageIndex - 1))}>‹</button>
        </div>
      </div>
      <button className="wishlist-icon" type="button" onClick={() => setWishlisted(!wishlisted)} aria-label="Toggle wishlist">
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
