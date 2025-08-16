import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const API_BASE_URL = import.meta.env.VITE_API_BASE
const PRODUCT_API_URL = `${API_BASE_URL}/products`
const UPLOAD_API_URL = `${PRODUCT_API_URL}/upload_image.php`

function transformProductData(product) {
  if (!product) return null
  return {
    ...product,
    product_id: Number(product.product_id),
    price: Number(product.price),
    category_id: Number(product.category_id),
    status: Number(product.status),
    size: product.size ? String(product.size).split(',') : [],
  }
}

export const useProductStore = defineStore('productAdmin', () => {
  const products = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const currentProduct = reactive({ data: null })
  const isFormLoading = ref(false)
  const formError = ref(null)

  const getProductById = computed(() => {
    return (id) => products.value.find((p) => p.product_id === Number(id))
  })
  async function fetchProducts() {
    isLoading.value = true
    error.value = null
    try {
      const timestamp = new Date().getTime()
      const response = await axios.get(`${PRODUCT_API_URL}/get_product.php?_=${timestamp}`)
      if (response.status !== 200 || !response.data) {
        throw new Error('無法從伺服器獲取商品資料')
      }
      products.value = response.data.map(transformProductData)
    } catch (err) {
      error.value = err.response?.data?.error || err.message || '獲取商品資料失敗'
      console.error('獲取商品資料失敗:', err.response?.data || err)
    } finally {
      isLoading.value = false
    }
  }
  async function uploadImage(file, type = 'products') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      const response = await axios.post(UPLOAD_API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status !== 200 || !response.data?.url) {
        throw new Error('圖片上傳失敗')
      }
      return response.data.url
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || '圖片上傳時發生未知錯誤'
      console.error('圖片上傳失敗:', err.response?.data || err)
      ElMessage.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
  async function addProduct(formData) {
    isFormLoading.value = true
    formError.value = null
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/post_product.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status !== 201) {
        throw new Error('新增商品失敗')
      }
      ElMessage.success(response.data.message || '商品新增成功！')
      await fetchProducts()
      return response.data
    } catch (err) {
      formError.value = err.response?.data?.error || err.message || '新增商品失敗'
      console.error('新增商品失敗:', err.response?.data || err)
      throw new Error(formError.value)
    } finally {
      isFormLoading.value = false
    }
  }
  async function updateProduct(formData) {
    isFormLoading.value = true
    formError.value = null
    try {
      const response = await axios.post(`${PRODUCT_API_URL}/put_product.php`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status !== 200) {
        throw new Error('更新商品失敗')
      }
      ElMessage.success(response.data.message || '商品更新成功！')
      await fetchProducts()
      return response.data
    } catch (err) {
      formError.value = err.response?.data?.error || err.message || '更新商品失敗'
      console.error('更新商品失敗:', err.response?.data || err)
      throw new Error(formError.value)
    } finally {
      isFormLoading.value = false
    }
  }
  async function fetchProductForEdit(productId) {
    isFormLoading.value = true
    formError.value = null
    try {
      const response = await axios.get(`${PRODUCT_API_URL}/get_product.php?product_id=${productId}`)
      if (response.status !== 200 || !response.data || response.data.length === 0) {
        throw new Error(`找不到 ID 為 ${productId} 的商品`)
      }
      const productData = transformProductData(response.data[0])
      currentProduct.data = { ...productData }
    } catch (err) {
      formError.value = err.message
      ElMessage.error(formError.value)
    } finally {
      isFormLoading.value = false
    }
  }
  async function generateNextSku(category) {
    console.log('Generating SKU for category:', category)
    try {
      await fetchProducts()
      const categoryPrefixes = {
        機能服飾: 'FA',
        各類包款: 'BG',
        周邊小物: 'AC',
      }
      const prefix = categoryPrefixes[category] || 'GEN'
      const searchPrefix = `${prefix}-`
      const categoryProducts = products.value.filter(
        (p) => p.sku && String(p.sku).startsWith(searchPrefix)
      )
      let maxSerial = 0
      categoryProducts.forEach((p) => {
        const parts = String(p.sku).split('-')
        if (parts.length === 2) {
          const serial = parseInt(parts[1], 10)
          if (!isNaN(serial) && serial > maxSerial) {
            maxSerial = serial
          }
        }
      })
      const newSerial = String(maxSerial + 1).padStart(2, '0')
      return `${searchPrefix}${newSerial}`
    } catch (error) {
      console.error('SKU 生成失敗:', error)
      throw new Error('無法生成 SKU，請確認後端資料。')
    }
  }

  function clearCurrentProduct() {
    currentProduct.data = null
  }

  return {
    products,
    isLoading,
    error,
    getProductById,
    fetchProducts,
    addProduct,
    updateProduct,
    currentProduct,
    isFormLoading,
    formError,
    fetchProductForEdit,
    clearCurrentProduct,
    generateNextSku,
    uploadImage,
  }
})
