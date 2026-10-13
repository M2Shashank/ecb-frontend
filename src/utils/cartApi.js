import { api } from './auth'
import { mapProduct } from './productsApi'

export async function getCart() {
  const response = await api.get('/cart?expand=product')
  return {
    items: (response.data.items || []).map((item) => ({
      ...item,
      product: mapProduct(item.product),
    })),
    totalCost: response.data.totalCost || 0,
  }
}

export async function addCartItem(product, size) {
  await api.post('/cart', {
    productId: product.backendId || product._id,
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
