import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

// .env 需有：VITE_API_BASE=http://localhost:8888/guardSea/coupon
const API_BASE_URL = import.meta.env.VITE_API_BASE
const COUPONS_LIST_URL = '/coupon/get_coupons.php'
const COUPON_PATCH_URL = (id) => `/coupon/patch_coupons.php?id=${id}`

// 建立 axios 實例（之後要加攔截器也方便）
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const useCouponStore = defineStore('coupon', () => {
  const coupons = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // 後端 -> 前端（前端統一用 id）
  function normalize(row) {
    return {
      id: row.coupon_id,
      quiz_id: row.quiz_id ?? null,
      type: row.type ?? null,
      trigger_event: row.trigger_event ?? null,
      value: row.value ?? null,
      title: row.title ?? '',
      description: row.description ?? '',
      coupon_code_prefix: row.coupon_code_prefix ?? '',
      min_order_amount: row.min_order_amount ?? null,
      valid_days: row.valid_days ?? null,
    }
  }

  // 只送可更新欄位（空字串->null、數字轉 number）
  function toPatchPayload(updated) {
    const allow = [
      'quiz_id',
      'type',
      'trigger_event',
      'value',
      'title',
      'description',
      'coupon_code_prefix',
      'min_order_amount',
      'valid_days',
    ]
    const numeric = new Set(['quiz_id', 'value', 'min_order_amount', 'valid_days'])
    const p = {}
    for (const k of allow) {
      if (Object.prototype.hasOwnProperty.call(updated, k)) {
        let v = updated[k]
        if (v === '') v = null
        if (v != null && numeric.has(k)) {
          const n = Number(v)
          v = Number.isNaN(n) ? null : n
        }
        p[k] = v
      }
    }
    return p
  }

  // 讀取列表（axios GET）
  async function fetchCoupons(params = {}) {
    isLoading.value = true
    error.value = null
    try {
      const { q = '', limit = 50, offset = 0 } = params
      const { data } = await api.get(COUPONS_LIST_URL, { params: { q, limit, offset } })
      coupons.value = (data.items || []).map(normalize)
    } catch (e) {
      //console.error(e)
      error.value = e?.response?.data?.error || e.message || '讀取優惠券列表失敗'
      coupons.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 更新單筆（axios PATCH）
  async function updateCoupon(couponId, updatedFields) {
    isLoading.value = true
    error.value = null
    try {
      const payload = toPatchPayload(updatedFields)
      //console.log('Payload to be sent:', payload) // <-- 添加這行
      let resp
      try {
        // 先嘗試原生 PATCH（axios）
        resp = await api.patch(COUPON_PATCH_URL(couponId), payload)
      } catch (err) {
        // 若伺服器不接受 PATCH（常見回 405），自動 fallback
        const status = err?.response?.status
        if (status === 405) {
          resp = await api.post(COUPON_PATCH_URL(couponId), payload, {
            headers: { 'X-HTTP-Method-Override': 'PATCH' },
          })
        } else {
          throw err
        }
      }

      const data = resp.data
      const i = coupons.value.findIndex((c) => c.id === couponId)

      // 確保找到要更新的優惠券，並使用 Object.assign 進行響應式更新
      if (i !== -1 && data?.coupon) {
        // ✅ 關鍵修改：用 Object.assign 覆蓋舊物件屬性，觸發響應式更新
        Object.assign(coupons.value[i], normalize(data.coupon))
      }

      return true
    } catch (e) {
      //console.error(e)
      error.value = e?.response?.data?.error || e.message || '更新失敗'
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { coupons, isLoading, error, fetchCoupons, updateCoupon }
})

// import { fakeCoupons } from '@/data/product/coupons'

// export const useCouponStore = defineStore('coupon', () => {
//   const coupons = ref([])
//   const isLoading = ref(false)
//   const error = ref(null)

//   async function fetchCoupons() {
//     isLoading.value = true
//     error.value = null
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 500))

//       coupons.value = JSON.parse(JSON.stringify(fakeCoupons))
//     } catch (err) {
//       error.value = '讀取優惠券列表失敗'
//       //console.error(err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   async function updateCoupon(couponId, updatedFields) {
//     await new Promise((resolve) => setTimeout(resolve, 300))

//     const couponToUpdate = coupons.value.find((c) => c.id === couponId)
//     if (couponToUpdate) {
//       Object.assign(couponToUpdate, updatedFields)
//       return true
//     }
//     return false
//   }

//   return {
//     coupons,
//     isLoading,
//     error,
//     fetchCoupons,
//     updateCoupon,
//   }
// })
