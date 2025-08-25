<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import Tablelist from '@/components/tablelist.vue'
  import { useProductStore } from '@/stores/product_store'
  import { useProductCategoryStore } from '@/stores/product_category_store'

  const router = useRouter()
  const productStore = useProductStore()
  const categoryStore = useProductCategoryStore()

  // 1. (新增) 讀取 Vite 環境變數
  const API_BASE_URL = import.meta.env.VITE_API_BASE

  // 2. (新增) 在此元件內定義 getImageUrl 函式
  const getImageUrl = (path) => {
    if (!path || path.startsWith('http')) {
      return path
    }
    return `${API_BASE_URL}${path}`
  }
  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const categoryOptions = ref([])

  onMounted(() => {
    productStore.fetchProducts()
    categoryStore.fetchCategories()
  })

  watch(
    [() => productStore.products, () => categoryStore.categories],
    ([products, categories]) => {
      if (products.length > 0 && categories.length > 0) {
        const productCounts = {}
        products.forEach((item) => {
          const category = categories.find((c) => Number(c.category_id) === item.category_id)
          if (category) {
            productCounts[category.category_id] = (productCounts[category.category_id] || 0) + 1
          }
        })
        const options = categories.map((cat) => ({
          label: cat.category_name,
          value: cat.category_id,
          count: productCounts[cat.category_id] || 0,
        }))

        categoryOptions.value = options
      }
    },
    { immediate: true }
  )

  const filteredData = computed(() => {
    let data = [...productStore.products]
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => Number(item.category_id) === Number(selectedCategory.value))
    }
    return data
  })

  watch(selectedCategory, () => {
    currentPage.value = 1
  })

  const handleAddNew = () => {
    router.push({ name: 'productadd' })
  }

  const handleEdit = (row) => {
    router.push({ name: 'productedit', params: { id: row.product_id } })
  }
</script>

<template>
  <div class="page-container">
    <div v-if="productStore.isLoading || categoryStore.isLoading" class="loading-state">
      <h2>⏳ 正在載入資料...</h2>
    </div>
    <div v-else-if="productStore.error || categoryStore.error" class="error-state">
      <h2>❌ 讀取資料失敗：{{ productStore.error || categoryStore.error }}</h2>
    </div>
    <Tablelist
      v-else
      title="商品管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      :show-add-button="true"
      add-button-text="+ 新增商品"
      @add="handleAddNew"
      :show-category-filter="true"
      v-model:category="selectedCategory"
      :show-search="false"
      all-label="全部商品"
    >
      <template #default="scope">
        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="sku" label="商品編號" width="180" />
          <el-table-column label="商品圖片" width="150" align="center">
            <template #default="scope">
              <div class="image-container">
                <el-image
                  v-if="scope.row.main_image_url"
                  :src="getImageUrl(scope.row.main_image_url)"
                  fit="cover"
                  style="width: 100%; height: 100%"
                />
                <span v-else class="no-image-text">暫無圖片</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="商品名稱" min-width="250" />
          <el-table-column label="商品分類" width="150" align="center">
            <template #default="scope">
              {{
                categoryStore.categories.find(
                  (c) => Number(c.category_id) === scope.row.category_id
                )?.category_name || '未知'
              }}
            </template>
          </el-table-column>
          <el-table-column label="商品狀態" width="150" align="center">
            <template #default="scope">
              <el-tag :type="Number(scope.row.status) === 1 ? 'success' : 'info'">
                {{ Number(scope.row.status) === 1 ? '上架' : '下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="商品價格" width="150" align="center">
            <template #default="scope">${{ scope.row.price?.toLocaleString() }}</template>
          </el-table-column>
          <el-table-column label="編輯" width="100" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Tablelist>
  </div>
</template>
<style lang="scss" scoped>
  .page-container {
    width: 100%;
    box-sizing: border-box;
  }
  .loading-state,
  .error-state {
    text-align: center;
    color: #909399;
  }
  .image-container {
    width: 80px;
    aspect-ratio: 1 / 1;
    background-color: #f5f5f5;
    border: 1px solid #ddd;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    border-radius: 4px;
  }
  .no-image-text {
    color: #aaa;
    font-size: 12px;
  }
  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
