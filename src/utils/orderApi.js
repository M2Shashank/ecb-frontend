import { api } from './auth'
import { mapProduct } from './productsApi'

function mapOrder(order) {
  return {
    ...order,
    orderItems: (order.orderItems || []).map((item) => ({
      ...item,
      product: typeof item.product === 'object' ? mapProduct(item.product) : item.product,
    })),
  }
}

export async function createOrder() {
  const response = await api.post('/order')
  return mapOrder(response.data.order)
}

export async function createProductOrder(productId, size, quantity) {
  const response = await api.post(`/order/${productId}`, { size, quantity })
  return mapOrder(response.data.order)
}

export async function getOrders() {
  const response = await api.get('/order?expand=products')
  return (response.data.orders || []).map(mapOrder)
}
