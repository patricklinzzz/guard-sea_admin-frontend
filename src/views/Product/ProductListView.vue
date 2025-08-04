<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import Tablelist from '@/components/tablelist.vue'
  import { useProductStore } from '@/stores/product_store'

  const router = useRouter()
  const productStore = useProductStore()

  const currentPage = ref(1)
  const selectedCategory = ref('all')

  onMounted(() => {
    productStore.fetchProducts()
  })

  const categoryOptions = computed(() => {
    const counts = {}
    productStore.products.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      label: key,
      value: key,
      count,
    }))
  })

  const filteredData = computed(() => {
    let data = [...productStore.products]
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => item.category === selectedCategory.value)
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
    router.push({ name: 'productedit', params: { id: row.id } })
  }
</script>

<template>
  <div class="page-container">
    <div v-if="productStore.isLoading" class="loading-state">
      <h2>⏳ 正在載入資料...</h2>
    </div>
    <div v-else-if="productStore.error" class="error-state">
      <h2>❌ 讀取資料失敗：{{ productStore.error }}</h2>
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

          <el-table-column label="商品圖片" width="120" align="center">
            <template #default="scope">
              <div class="image-container">
                <el-image
                  v-if="scope.row.mainImageUrl"
                  :src="scope.row.mainImageUrl"
                  fit="cover"
                  style="width: 100%; height: 100%"
                />
                <span v-else class="no-image-text">暫無圖片</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="name" label="商品名稱" min-width="250" />

          <el-table-column prop="category" label="商品分類" width="120" align="center" />

          <el-table-column prop="status" label="商品狀態" width="120" align="center">
            <template #default="scope">
              <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="price" label="商品價格" width="120" align="center">
            <template #default="scope">${{ scope.row.price.toLocaleString() }}</template>
          </el-table-column>

          <el-table-column label="編輯" width="80" align="center">
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
    padding: 2rem;
  }
  .loading-state,
  .error-state {
    text-align: center;
    padding: 4rem;
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
