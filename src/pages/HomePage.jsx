import { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import './HomePage.css'
import { asset } from '../utils/assets'
import { getProducts } from '../utils/productsApi'

function getInitialCart() {
  try {
    return JSON.parse(localStorage.getItem('cart') || '[]').reduce((total, item) => total + item.quantity, 0)
  } catch {
    return 0
  }
}

function HomePage() {
  const [products, setProducts] = useState([])
  const [cartQuantity, setCartQuantity] = useState(getInitialCart)
  const [sort, setSort] = useState('featured')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    getProducts()
      .then((nextProducts) => {
        if (mounted) setProducts(nextProducts)
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

  const sortedProducts = useMemo(() => {
    const result = [...products]
    if (sort === 'price-lth') result.sort((a, b) => a.afterPriceRs - b.afterPriceRs)
    if (sort === 'price-htl') result.sort((a, b) => b.afterPriceRs - a.afterPriceRs)
    if (sort === 'best-selling') result.reverse()
    return result
  }, [products, sort])

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const size = product.availableSizes[0]
    const item = cart.find((cartItem) => cartItem.cartItemSku === product.sku && cartItem.size === size)
    if (item) item.quantity += 1
    else cart.push({ cartItemSku: product.sku, quantity: 1, size })
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartQuantity(cart.reduce((total, cartItem) => total + cartItem.quantity, 0))
  }

  return (
    <div className="home-page">
      <Header cartQuantity={cartQuantity} />
      <main className="main-container">
        <section className="new-arrivals">
          <img className="new-arrivals-banner" src={asset('main-assets/newCollections-Banner.webp')} alt="New arrivals" />
          <div className="absolute-text-container">
            <div className="text-row-1"><a href="/">Home</a><i>/</i><a href="/">Shop</a><i>/</i>New Arrivals</div>
            <div className="text-row-2"><h1>NEW ARRIVALS</h1></div>
            <div className="text-row-3">
              {[['all_day_comfort_fit_1.png', 'All-Day Comfort Fit'], ['effortless_Fresh_Look.webp', 'Effortless Fresh Look'], ['Easy_to_Style_1.jpg', 'Easy To Style Silhouettes']].map(([image, text]) => (
                <div className="brand-attributes-div" key={text}><img src={asset(`main-assets/${image}`)} alt="" /><span>{text}</span></div>
              ))}
            </div>
          </div>
        </section>
        <section className="products-container">
          <div className="products-navigation">
            <button className="filters-navigation" type="button"><span aria-hidden="true">☷</span> FILTER AND SORT</button>
            <div className="sorting-navigation">
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
                <option value="featured">FEATURED</option>
                <option value="best-selling">BEST SELLING</option>
                <option value="price-lth">PRICE, LOW TO HIGH</option>
                <option value="price-htl">PRICE, HIGH TO LOW</option>
              </select>
              <span>{sortedProducts.length} PRODUCTS</span>
            </div>
          </div>
          <div className="products-grid">
            {loading && <p>Loading products...</p>}
            {!loading && error && <p role="alert">{error}</p>}
            {!loading && !error && sortedProducts.map((product) => <ProductCard product={product} onAddToCart={addToCart} key={product.sku} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
