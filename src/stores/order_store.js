import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const API_BASE_URL = import.meta.env.VITE_API_BASE
const ORDER_API_URL = `${API_BASE_URL}/orders`

export const useOrderStore = defineStore('orders', () => {
  const orders = ref([])
  const currentOrder = ref(null)
  const isLoading = ref(false)
  const isDetailLoading = ref(false)
  const error = ref(null)

  const getOrderById = computed(() => {
    return (orderId) => orders.value.find((order) => Number(order.order_id) === Number(orderId))
  })

  async function fetchOrders() {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get(`${ORDER_API_URL}/get_orders.php`, {
        withCredentials: true,
      })
      if (response.status !== 200 || !response.data) {
        throw new Error('無法從伺服器獲取訂單資料')
      }
      orders.value = response.data.orders
    } catch (err) {
      error.value = err.response?.data?.error || err.message || '讀取訂單列表失敗'
      //console.error('讀取訂單列表失敗:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOrderDetails(orderId) {
    isDetailLoading.value = true
    error.value = null
    currentOrder.value = null
    try {
      const response = await axios.get(`${ORDER_API_URL}/get_order_details.php`, {
        params: { order_id: orderId },
        withCredentials: true,
      })
      if (response.status !== 200 || !response.data?.order) {
        throw new Error('無法從伺服器獲取訂單詳細資訊')
      }
      currentOrder.value = response.data.order
    } catch (err) {
      error.value = err.response?.data?.error || err.message || '讀取訂單詳細資訊失敗'
      //console.error('讀取訂單詳細資訊失敗:', err)
    } finally {
      isDetailLoading.value = false
    }
  }

  async function updateOrderStatus(orderId, newStatus) {
    try {
      const response = await axios.post(
        `${ORDER_API_URL}/patch_order.php`,
        {
          order_id: orderId,
          status: newStatus,
          _method: 'PATCH',
        },
        { withCredentials: true }
      )
      if (response.status === 200) {
        ElMessage.success('訂單狀態更新成功')
        const orderInList = orders.value.find((o) => Number(o.order_id) === Number(orderId))
        if (orderInList) {
          orderInList.status = newStatus
        }
        if (currentOrder.value && Number(currentOrder.value.order_id) === Number(orderId)) {
          currentOrder.value.status = newStatus
        }
      } else {
        throw new Error(response.data.error || '訂單狀態更新失敗')
      }
    } catch (err) {
      ElMessage.error(err.message)
      //console.error('更新訂單狀態失敗:', err)
    }
  }

  async function updateOrderNotes(orderId, newNotes) {
    try {
      const response = await axios.post(
        `${ORDER_API_URL}/patch_order.php`,
        {
          order_id: orderId,
          notes: newNotes,
          _method: 'PATCH',
        },
        { withCredentials: true }
      )
      if (response.status === 200) {
        ElMessage.success('訂單備註更新成功')
        const orderInList = orders.value.find((o) => Number(o.order_id) === Number(orderId))
        if (orderInList) {
          orderInList.notes = newNotes
        }
        if (currentOrder.value && Number(currentOrder.value.order_id) === Number(orderId)) {
          currentOrder.value.notes = newNotes
        }
        return true
      } else {
        throw new Error(response.data.error || '訂單備註更新失敗')
      }
    } catch (err) {
      ElMessage.error(err.message)
      //console.error('更新訂單備註失敗:', err)
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
    fetchOrderDetails,
    updateOrderStatus,
    updateOrderNotes,
  }
})
