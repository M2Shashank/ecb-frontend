import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductShelf from '../components/ProductShelf'
import { sizeChart } from '../../data/sizeChart.js'
import { asset } from '../utils/assets'
import { addCartItem, getCart } from '../utils/cartApi'
import { getProduct } from '../utils/productsApi'
import './ProductPage.css'

function ProductPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getProduct(productId)
      .then((nextProduct) => {
        if (!mounted) return
        setProduct(nextProduct)
        setSelectedSize(nextProduct.availableSizes[0] || '')
        setSelectedImage(nextProduct.images[0] || '')
        setWishlisted(Boolean(nextProduct.inWishlist))
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
  }, [productId])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [productId])

  const measurements = useMemo(() => {
    if (!product || !selectedSize || !sizeChart[product.category]) return null
    return sizeChart[product.category][selectedSize]
  }, [product, selectedSize])

  const updateCartQuantity = async () => {
    const nextCart = await getCart()
    setCartQuantity(nextCart.items.reduce((total, item) => total + item.quantity, 0))
  }

  const addProductToCart = async () => {
    try {
      await addCartItem(product, selectedSize)
      await updateCartQuantity()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) {
    return <><Header cartQuantity={0} /><main className="product-not-found"><p>Loading product...</p></main><Footer /></>
  }

  if (error || !product) {
    return (
      <>
        <Header cartQuantity={0} />
        <main className="product-not-found">
          <h1>{error || 'Product not found'}</h1>
          <Link to="/">Return to shopping</Link>
        </main>
        <Footer />
      </>
    )
  }

  const discount = product.priceRs ? Math.round(((product.priceRs - product.afterPriceRs) / product.priceRs) * 100) : 0

  return (
    <div className="product-page">
      <Header cartQuantity={cartQuantity} />
      <main className="product-main-container">
        <div className="page-path"><Link to="/">Home</Link> / Products / <span>{product.name}</span></div>
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
            <div className="main-image-container"><img className="main-display-image" src={asset(selectedImage)} alt={product.name} /></div>
          </div>
          <div className="information-section">
            <div className="display-product-container">
              <h1 className="display-product-name">{product.name}</h1>
              <button className="display-wishlist-icon" type="button" onClick={() => setWishlisted(!wishlisted)} aria-label="Toggle wishlist">
                <img className="display-heart-icon" src={asset(`assets/main-assets/${wishlisted ? 'heartFilled_icon.svg' : 'heartEmpty_icon.svg'}`)} alt="" />
              </button>
            </div>
            <div className="display-product-price"><del className="display-original-price">Rs.{product.priceRs}</del><ins className="display-discounted-price">Rs.{product.afterPriceRs}</ins><span className="display-discount-alert">SAVE {discount}%</span></div>
            <div className="size-section">
              <div className="size-info"><span className="size-label">SIZE: <span className="selected-size">{selectedSize}</span></span><div className="measurements"><span>{product.category === 'Shirt' ? 'CHEST' : 'WAIST'} <b>{measurements?.chest || measurements?.waist || '-'} INCHES</b></span><span className="separator" /><span>LENGTH <b>{measurements?.length || '-'} INCHES</b></span></div></div>
              <div className="size-grid">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                  const available = product.availableSizes.includes(size)
                  return <button className={`size-button${selectedSize === size ? ' selected' : ''}${!available ? ' unavailable' : ''}`} disabled={!available} type="button" onClick={() => setSelectedSize(size)} key={size}>{size}</button>
                })}
              </div>
            </div>
            <button className="add-to-cart-button" type="button" onClick={addProductToCart}>ADD TO CART</button>
            <button className="buy-it-now-button" type="button" onClick={addProductToCart}>BUY IT NOW</button>
            <div className="product-description"><p>{product.description}</p></div>
            <div className="product-information"><p><b>Composition:</b> {product.composition || '-'}<br /><b>GSM:</b> {product.gsm || '-'}<br /><b>Color:</b> {product.color}<br /><b>Country of production:</b> India</p></div>
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
