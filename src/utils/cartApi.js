import { products as localProducts } from '../../data/products.js'
import { api } from './auth'

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function findLocalProduct(backendProduct) {
  if (!backendProduct || typeof backendProduct !== 'object') return null

  return localProducts.find((product) => (
    normalize(product.name) === normalize(backendProduct.name)
    && normalize(product.gender) === normalize(backendProduct.gender)
    && normalize(product.color) === normalize(backendProduct.color)
  )) || localProducts.find((product) => (
    normalize(product.name) === normalize(backendProduct.name)
    && normalize(product.gender) === normalize(backendProduct.gender)
  ))
}

async function getBackendProduct(localProduct) {
  const response = await api.get('/products')
  const backendProduct = response.data.products.find((product) => (
    normalize(product.name) === normalize(localProduct.name)
    && normalize(product.gender) === normalize(localProduct.gender)
    && normalize(product.color) === normalize(localProduct.color)
  )) || response.data.products.find((product) => (
    normalize(product.name) === normalize(localProduct.name)
    && normalize(product.gender) === normalize(localProduct.gender)
  ))

  if (!backendProduct?._id) {
    throw new Error(`Could not find "${localProduct.name}" in the backend catalog.`)
  }
  return backendProduct
}

export async function getCart() {
  const response = await api.get('/cart?expand=product')
  return {
    items: response.data.items || [],
    totalCost: response.data.totalCost || 0,
  }
}

export async function addCartItem(product, size) {
  const backendProduct = await getBackendProduct(product)
  await api.post('/cart', {
    productId: backendProduct._id,
    quantity: 1,
    size,
  })
  return getCart()
}

export async function updateCartItem(cartItemId, quantity) {
  if (quantity <= 0) {
    await api.delete(`/cart/${cartItemId}`)
  } else {
    await api.patch(`/cart/${cartItemId}`, { quantity })
  }
  return getCart()
}

export function getLocalProduct(cartItem) {
  return findLocalProduct(cartItem.product)
}
