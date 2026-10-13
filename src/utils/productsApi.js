import { api } from './auth'

const API_ORIGIN = 'http://localhost:3000'

function resolveImageUrl(path) {
  if (/^(https?:)?\/\//.test(path)) return path
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

function mapProduct(product, index) {
  return {
    ...product,
    backendId: product._id,
    sku: index,
    images: (product.images || []).map(resolveImageUrl),
    priceRs: product.pricing?.price || 0,
    afterPriceRs: product.pricing?.salePrice || product.pricing?.price || 0,
    availableSizes: (product.sizes || []).map(({ size }) => size),
    description: product.description || '',
    tags: product.tags || [],
    inWishlist: false,
  }
}

export async function getProducts() {
  const response = await api.get('/products/')
  return (response.data.products || []).map(mapProduct)
}

export async function getProduct(productId) {
  const response = await api.get(`/products/${productId}`)
  return mapProduct(response.data.product, 0)
}
