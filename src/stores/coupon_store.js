import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fakeCoupons } from '@/data/product/coupons'

export const useCouponStore = defineStore('coupon', () => {
  const coupons = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  async function fetchCoupons() {
    isLoading.value = true
    error.value = null
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      coupons.value = JSON.parse(JSON.stringify(fakeCoupons))
    } catch (err) {
      error.value = '讀取優惠券列表失敗'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  async function updateCoupon(couponId, updatedFields) {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const couponToUpdate = coupons.value.find((c) => c.id === couponId)
    if (couponToUpdate) {
      Object.assign(couponToUpdate, updatedFields)
      return true
    }
    return false
  }

  return {
    coupons,
    isLoading,
    error,
    fetchCoupons,
    updateCoupon,
  }
})
