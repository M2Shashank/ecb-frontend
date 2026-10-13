import { api } from './auth'

export async function getWishlistIds() {
  const response = await api.get('/wishlist')
  return response.data.items || []
}

export async function addToWishlist(productId) {
  await api.post(`/wishlist/${productId}`)
}

export async function removeFromWishlist(productId) {
  await api.delete(`/wishlist/${productId}`)
}
