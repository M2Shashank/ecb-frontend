import { useMemo } from 'react'
import ProductCard from './ProductCard'
import { products, getSimilarProducts } from '../../data/products.js'
import { recentlyViewedProducts } from '../../data/recentlyViewed.js'
import './ProductShelf.css'

function ProductShelf({ product, type = 'recently-viewed', onAddToCart }) {
  const shelfProducts = useMemo(() => {
    if (type === 'related') return getSimilarProducts(product)
    return recentlyViewedProducts
      .map(({ itemSku }) => products.find((item) => item.sku === itemSku))
      .filter(Boolean)
  }, [product, type])

  if (!shelfProducts.length) return null

  return (
    <section className="product-shelf">
      <h2>{type === 'related' ? 'YOU MAY ALSO LIKE' : 'Recently viewed products'}</h2>
      <div className="product-shelf-grid">
        {shelfProducts.map((item) => (
          <ProductCard product={item} onAddToCart={onAddToCart} key={item.sku} />
        ))}
      </div>
    </section>
  )
}

export default ProductShelf
