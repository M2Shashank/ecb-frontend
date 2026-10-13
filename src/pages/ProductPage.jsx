import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductShelf from '../components/ProductShelf'
import { sizeChart } from '../../data/sizeChart.js'
import { asset } from '../utils/assets'
import { addCartItem, getCart } from '../utils/cartApi'
import { isAuthenticated } from '../utils/auth'
import { getProduct } from '../utils/productsApi'
import { createProductOrder } from '../utils/orderApi'
import { addToWishlist, getWishlistIds, removeFromWishlist } from '../utils/wishlistApi'
import './ProductPage.css'

function ProductPage({ products }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [cartQuantity, setCartQuantity] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [productId])

  useEffect(() => {
    let mounted = true
    getProduct(productId)
      .then((nextProduct) => {
        if (!mounted) return
        setProduct(nextProduct)
        setSelectedSize(nextProduct.availableSizes[0] || '')
        setSelectedImage(nextProduct.images[0] || '')
        if (isAuthenticated()) {
          getWishlistIds()
            .then((wishlistIds) => setWishlisted(wishlistIds.includes(nextProduct.backendId)))
            .catch(() => setWishlisted(false))
        } else {
          setWishlisted(false)
        }
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

  const measurements = useMemo(() => {
    if (!product || !selectedSize || !sizeChart[product.category]) return null
    return sizeChart[product.category][selectedSize]
  }, [product, selectedSize])

  const updateCartQuantity = async () => {
    const nextCart = await getCart()
    setCartQuantity(nextCart.items.reduce((total, item) => total + item.quantity, 0))
  }

  const addProductToCart = async () => {
    if (!isAuthenticated()) {
      window.alert('Please log in to add items to your cart.')
      return
    }

    try {
      setAddingToCart(true)
      await addCartItem(product, selectedSize)
      await updateCartQuantity()
      setAddedToCart(true)
      setError('')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setAddingToCart(false)
    }
  }

  const buyProductNow = async () => {
    if (!isAuthenticated()) {
      window.alert('Please log in to buy this product.')
      return
    }
    const selectedSizeStock = product.sizes?.find(({ size }) => size === selectedSize)?.stock
    const quantityInput = window.prompt(`How many would you like to order? Available stock: ${selectedSizeStock || 0}`, '1')
    if (quantityInput === null) return
    const quantity = Number(quantityInput)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > selectedSizeStock) {
      window.alert(`Please enter a whole number between 1 and ${selectedSizeStock || 0}.`)
      return
    }
    try {
      setBuyingNow(true)
      setError('')
      await createProductOrder(product.backendId, selectedSize, quantity)
      navigate('/orders')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBuyingNow(false)
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
                    <img className="thumbnail" src={image} alt={`${product.name} view`} />
                  </button>
                ))}
              </div>
              <button type="button" className="thumbnail-button" aria-label="Next images">⌄</button>
            </div>
            <div className="main-image-container"><img className="main-display-image" src={selectedImage} alt={product.name} /></div>
          </div>
          <div className="information-section">
            <div className="display-product-container">
              <h1 className="display-product-name">{product.name}</h1>
              <button className="display-wishlist-icon" type="button" onClick={() => {
                if (!isAuthenticated()) {
                  window.alert('Please log in to manage your wishlist.')
                  return
                }
                const nextWishlisted = !wishlisted
                const request = nextWishlisted ? addToWishlist : removeFromWishlist
                request(product.backendId)
                  .then(() => setWishlisted(nextWishlisted))
                  .catch((requestError) => setError(requestError.message))
              }} aria-label="Toggle wishlist">
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
            <button className="add-to-cart-button" type="button" disabled={addingToCart} onClick={addProductToCart}>{addingToCart ? 'ADDING...' : addedToCart ? 'ADDED TO CART' : 'ADD TO CART'}</button>
            <button className="buy-it-now-button" type="button" disabled={addingToCart || buyingNow} onClick={buyProductNow}>{buyingNow ? 'CREATING ORDER...' : 'BUY IT NOW'}</button>
            {error && <p role="alert">{error}</p>}
            <div className="product-description"><p>{product.description}</p></div>
            <div className="product-information"><p><b>Composition:</b> {product.composition || '-'}<br /><b>GSM:</b> {product.gsm || '-'}<br /><b>Color:</b> {product.color}<br /><b>Country of production:</b> India</p></div>
          </div>
        </section>
        <ProductShelf products={products} product={product} type="related" onAddToCart={addProductToCart} />
        <ProductShelf products={products} product={product} onAddToCart={addProductToCart} />
      </main>
      <Footer />
    </div>
  )
}

export default ProductPage
