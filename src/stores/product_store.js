import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { Products } from '@/data/product/products'

export const useProductStore = defineStore('productAdmin', () => {
  const products = ref([])
  const isLoading = ref(false)

  const currentProduct = reactive({ data: null })
  const isFormLoading = ref(false)
  const formError = ref(null)

  const getProductById = computed(() => {
    return (id) => products.value.find((p) => p.id === Number(id))
  })

  async function fetchProducts() {
    isLoading.value = true
    await new Promise((resolve) => setTimeout(resolve, 300))
    products.value = Products
    isLoading.value = false
  }

  async function addProduct(newProductData) {
    const newProduct = {
      ...newProductData,
      id: Date.now(),
    }
    products.value.unshift(newProduct)
    // 未來這裡會是: await axios.post('/api/products', newProductData)
  }
  async function updateProduct(updatedProductData) {
    const index = products.value.findIndex((p) => p.id === updatedProductData.id)
    if (index !== -1) {
      products.value[index] = updatedProductData
    }
    // 未來這裡會是: await axios.put(`/api/products/${updatedProductData.id}`, updatedProductData)
  }
  async function deleteProduct(productId) {
    products.value = products.value.filter((p) => p.id !== productId)
    // 未來這裡會是: await axios.delete(`/api/products/${productId}`)
  }

  async function fetchProductForEdit(productId) {
    isFormLoading.value = true
    formError.value = null
    try {
      if (products.value.length === 0) {
        await fetchProducts()
      }
      const productData = products.value.find((p) => p.id === Number(productId))

      if (productData) {
        const existingStyles = productData.styles.map((s, i) => ({
          ...s,
          uid: Date.now() + i,
          fileName: s.imageUrl.split('/').pop(),
          rawFile: { uid: Date.now() + i, name: s.imageUrl.split('/').pop() },
        }))
        currentProduct.data = { ...productData, styles: existingStyles }
      } else {
        throw new Error(`找不到 ID 為 ${productId} 的商品`)
      }
    } catch (err) {
      formError.value = err.message
    } finally {
      isFormLoading.value = false
    }
  }

  function clearCurrentProduct() {
    currentProduct.data = null
  }
  async function generateNextSku(category) {
    await fetchProducts()

    const categoryPrefixes = {
      機能服飾: 'FA',
      各類包款: 'BG',
      周邊小物: 'AC',
    }
    const prefix = categoryPrefixes[category] || 'GEN'
    const searchPrefix = `${prefix}-`

    const categoryProducts = products.value.filter((p) => p.sku && p.sku.startsWith(searchPrefix))

    let maxSerial = 0
    categoryProducts.forEach((p) => {
      const parts = p.sku.split('-')
      if (parts.length === 2) {
        const serial = parseInt(parts[1], 10)
        if (!isNaN(serial) && serial > maxSerial) {
          maxSerial = serial
        }
      }
    })

    const newSerial = String(maxSerial + 1).padStart(2, '0')
    return `${searchPrefix}${newSerial}`
  }

  return {
    products,
    isLoading,
    getProductById,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,

    currentProduct,
    isFormLoading,
    formError,
    fetchProductForEdit,
    clearCurrentProduct,
    generateNextSku,
  }
})
