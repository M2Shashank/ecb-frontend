import { useMemo } from 'react'
import ProductCard from './ProductCard'
import './ProductShelf.css'

function ProductShelf({ products, product, type = 'recently-viewed', onAddToCart }) {
  const shelfProducts = useMemo(() => {
    if (type === 'related') {
      return products.filter((item) => item.backendId !== product.backendId && item.category === product.category).slice(0, 4)
    }
    return []
  }, [products, product, type])

  if (!shelfProducts.length) return null

  return (
    <section className="product-shelf">
      <h2>{type === 'related' ? 'YOU MAY ALSO LIKE' : 'Recently viewed products'}</h2>
      <div className="product-shelf-grid">
        {shelfProducts.map((item) => (
          <ProductCard product={item} onAddToCart={onAddToCart} key={item.backendId || item.sku} />
        ))}
      </div>
    </section>
  )
}

export default ProductShelf
