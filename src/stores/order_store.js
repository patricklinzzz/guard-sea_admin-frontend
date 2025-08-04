import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Orders } from '@/data/product/orders'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])

  const currentOrder = ref(null)

  const isLoading = ref(false)
  const isDetailLoading = ref(false)

  const error = ref(null)

  const getOrderById = computed(() => {
    return (orderId) => orders.value.find((order) => order.id === orderId)
  })

  async function fetchOrders() {
    isLoading.value = true
    error.value = null
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      orders.value = Orders
    } catch (err) {
      error.value = '讀取訂單列表失敗'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrderById(orderId) {
    isDetailLoading.value = true
    error.value = null
    currentOrder.value = null
    try {
      await new Promise((resolve) => setTimeout(resolve, 400))

      const foundOrder = Orders.find((order) => order.id === orderId)

      if (foundOrder) {
        currentOrder.value = foundOrder
      } else {
        throw new Error('Order not found')
      }
    } catch (err) {
      error.value = `找不到 ID 為 ${orderId} 的訂單`
      console.error(err)
    } finally {
      isDetailLoading.value = false
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    // await api.put(`/orders/${orderId}`, { status: newStatus })

    const orderInList = orders.value.find((o) => o.id === orderId)
    if (orderInList) {
      orderInList.status = newStatus
      orderInList.statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      })
    }

    if (currentOrder.value && currentOrder.value.id === orderId) {
      currentOrder.value.status = newStatus
    }
  }
  async function updateOrderNotes(orderId, newNotes) {
    try {
      const orderToUpdate = orders.value.find((o) => o.id === orderId)
      if (orderToUpdate) {
        orderToUpdate.notes = newNotes
        await new Promise((resolve) => setTimeout(resolve, 300))
        return true 
      }
      return false 
    } catch (error) {
      console.error('更新備註失敗:', error)
      return false 
    }
  }
  return {
    orders,
    currentOrder,
    isLoading,
    isDetailLoading,
    error,
    getOrderById,
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    updateOrderNotes,
  }
})
