import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductShelf from '../components/ProductShelf'
import { products } from '../../data/products.js'
import { sizeChart } from '../../data/sizeChart.js'
import { cart as defaultCart } from '../../data/cart.js'
import { asset } from '../utils/assets'
import './ProductPage.css'

function readCart() {
  try {
    const storedCart = localStorage.getItem('cart')
    return storedCart ? JSON.parse(storedCart) : defaultCart
  } catch {
    return defaultCart
  }
}

function ProductPage() {
  const { sku } = useParams()
  const product = products.find((item) => item.sku === Number(sku))
  const [cart, setCart] = useState(readCart)
  const [selectedSize, setSelectedSize] = useState(product?.availableSizes[0])
  const [selectedImage, setSelectedImage] = useState(product?.images[0])
  const [wishlisted, setWishlisted] = useState(Boolean(product?.inWishlist))

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [sku])

  const measurements = useMemo(() => {
    if (!product || !selectedSize) return null
    return sizeChart[product.category][selectedSize]
  }, [product, selectedSize])

  if (!product) {
    return (
      <>
        <Header cartQuantity={0} />
        <main className="product-not-found">
          <h1>Product not found</h1>
          <Link to="/">Return to shopping</Link>
        </main>
        <Footer />
      </>
    )
  }

  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0)
  const discount = Math.round(((product.priceRs - product.afterPriceRs) / product.priceRs) * 100)
  const addProductToCart = () => {
    const nextCart = [...cart]
    const existingItem = nextCart.find((item) => item.cartItemSku === product.sku && item.size === selectedSize)
    if (existingItem) existingItem.quantity += 1
    else nextCart.push({ cartItemSku: product.sku, quantity: 1, size: selectedSize })
    setCart(nextCart)
    localStorage.setItem('cart', JSON.stringify(nextCart))
  }

  return (
    <div className="product-page">
      <Header cartQuantity={cartQuantity} />

      <main className="product-main-container">
        <div className="page-path">
          <Link to="/">Home</Link> / Products / <span>{product.name}</span>
        </div>
        <section className="product-content-container">
          <div className="image-section">
            <div className="thumbnail-wrapper">
              <button type="button" className="thumbnail-button" aria-label="Previous images">⌃</button>
              <div className="thumbnail-container">
                {product.images.map((image) => (
                  <button type="button" className={`thumbnail-button-image${selectedImage === image ? ' active' : ''}`} onClick={() => setSelectedImage(image)} key={image}>
                    <img className="thumbnail" src={asset(image)} alt={`${product.name} view`} />
                  </button>
                ))}
              </div>
              <button type="button" className="thumbnail-button" aria-label="Next images">⌄</button>
            </div>
            <div className="main-image-container">
              <img className="main-display-image" src={asset(selectedImage)} alt={product.name} />
            </div>
          </div>
          <div className="information-section">
            <div className="display-product-container">
              <h1 className="display-product-name">{product.name}</h1>
              <button className="display-wishlist-icon" type="button" onClick={() => setWishlisted(!wishlisted)} aria-label="Toggle wishlist">
                <img className="display-heart-icon" src={asset(`assets/main-assets/${wishlisted ? 'heartFilled_icon.svg' : 'heartEmpty_icon.svg'}`)} alt="" />
              </button>
            </div>
            <div className="display-product-price">
              <del className="display-original-price">Rs.{product.priceRs}</del>
              <ins className="display-discounted-price">Rs.{product.afterPriceRs}</ins>
              <span className="display-discount-alert">SAVE {discount}%</span>
            </div>
            <div className="size-section">
              <div className="size-info">
                <span className="size-label">SIZE: <span className="selected-size">{selectedSize}</span></span>
                <div className="measurements">
                  <span>{product.category === 'Shirt' ? 'CHEST' : 'WAIST'} <b>{measurements?.chest || measurements?.waist} INCHES</b></span>
                  <span className="separator" />
                  <span>LENGTH <b>{measurements?.length} INCHES</b></span>
                </div>
              </div>
              <div className="size-grid">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const available = product.availableSizes.includes(size)
                  return (
                    <button className={`size-button${selectedSize === size ? ' selected' : ''}${!available ? ' unavailable' : ''}`} disabled={!available} type="button" onClick={() => setSelectedSize(size)} key={size}>{size}</button>
                  )
                })}
              </div>
            </div>
            <button className="add-to-cart-button" type="button" onClick={addProductToCart}>ADD TO CART</button>
            <button className="buy-it-now-button" type="button" onClick={addProductToCart}>BUY IT NOW</button>
            <div className="product-description"><p>{product.description}</p></div>
            <div className="product-information">
              <p>
                <b>Composition:</b> {product.composition}<br />
                <b>GSM:</b> {product.gsm}<br />
                <b>Color:</b> {product.color}<br />
                <b>Country of production:</b> India<br />
                <b>Wash care:</b> Machine wash cold with similar colors. Only non-chlorine. Tumble dry low. Warm iron if needed.<br />
                <b>Sizing:</b> Garment measurement in inches.<br />
                Estimated order processing time: 48 hours.
              </p>
            </div>
          </div>
        </section>

        <ProductShelf product={product} type="related" onAddToCart={addProductToCart} />

        <ProductShelf product={product} onAddToCart={addProductToCart} />

      </main>
      
      <Footer />
    </div>
  )
}

export default ProductPage
