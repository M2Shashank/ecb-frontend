import axios from 'axios'
import { products as localProducts } from '../../data/products.js'

const AUTH_STORAGE_KEY = 'bonkers-authenticated'
const USER_STORAGE_KEY = 'bonkers-user'
const API_BASE_URL = 'http://localhost:3000/api'
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export function isAuthenticated() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === 'true'
}

export function setAuthenticated(value) {
  if (value) {
    localStorage.setItem(AUTH_STORAGE_KEY, 'true')
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
  }
}

export function getAuthenticatedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || 'null')
  } catch {
    return null
  }
}

export function setAuthenticatedUser(user) {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
  setAuthenticated(true)
}

async function requestAuth(path, body) {
  try {
    const response = await api.post(path, body)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Authentication request failed.', { cause: error })
  }
}

export function registerUser(credentials) {
  return requestAuth('/auth/register', credentials)
}

export function loginUser(credentials) {
  return requestAuth('/auth/login', credentials)
}

function normalize(value) {
  return String(value || '').trim().toLowerCase()
}

function findBackendProduct(localProduct, backendProducts) {
  return backendProducts.find((backendProduct) => (
    normalize(backendProduct.name) === normalize(localProduct.name)
    && normalize(backendProduct.gender) === normalize(localProduct.gender)
    && normalize(backendProduct.color) === normalize(localProduct.color)
  )) || backendProducts.find((backendProduct) => (
    normalize(backendProduct.name) === normalize(localProduct.name)
    && normalize(backendProduct.gender) === normalize(localProduct.gender)
  ))
}

function readStoredList(key, fallback = []) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback))
  } catch {
    return fallback
  }
}

async function syncLocalData() {
  const [productsResponse] = await Promise.all([
    api.get('/products'),
  ])
  const backendProducts = productsResponse.data.products || []
  const productIds = new Map()

  localProducts.forEach((localProduct) => {
    const backendProduct = findBackendProduct(localProduct, backendProducts)
    if (backendProduct?._id) {
      productIds.set(localProduct.sku, backendProduct._id)
    }
  })

  const cart = readStoredList('cart')
  const wishlist = readStoredList('wishlist')
  const recentlyViewed = readStoredList('recentlyViewed')
  const requests = []

  cart.forEach((item) => {
    const productId = productIds.get(item.cartItemSku)
    if (productId) {
      requests.push(api.post('/cart', {
        productId,
        quantity: item.quantity,
        size: item.size,
      }))
    }
  })

  wishlist.forEach((item) => {
    const productId = productIds.get(item.productSku)
    if (productId) {
      requests.push(api.post(`/wishlist/${productId}`))
    }
  })

  recentlyViewed.slice().reverse().forEach((item) => {
    const productId = productIds.get(item.itemSku)
    if (productId) {
      requests.push(api.post('/recently-viewed', { productId }))
    }
  })

  await Promise.all(requests)
}

export function syncLocalDataAfterLogin() {
  return syncLocalData()
}

export async function logoutUser() {
  try {
    const response = await api.post('/auth/logout')
    setAuthenticated(false)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Logout failed.', { cause: error })
  }
}
