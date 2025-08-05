<template>
  <div class="page-container">
    <Tablelist
      title="最新消息管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      :show-add-button="true"
      add-button-text="+ 新增消息"
      @add="handleAddNew"
      :show-category-filter="true"
      v-model:category="selectedCategory"
      :show-search="true"
      search-placeholder="請輸入標題關鍵字"
      v-model:searchTerm="searchText"
      :search-key="searchKey"
      all-label="全部消息"
      :page-size="5"
    >
      <template #default="scope">
        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="category" label="分類" width="120" align="center" />
          <el-table-column label="封面圖" width="160" align="center">
            <template #default="scope">
              <div
                style="
                  width: 120px;
                  aspect-ratio: 4 / 3;
                  background-color: #f5f5f5;
                  border: 1px solid #ddd;
                  overflow: hidden;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin: auto;
                "
              >
                <el-image
                  v-if="scope.row.coverimage"
                  :src="scope.row.coverimage"
                  fit="coverimage"
                  style="width: 100%; height: 100%"
                />
                <span v-else style="color: #aaa">暫無圖片</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="標題" width="350" />
          <el-table-column prop="date" label="日期" width="150" align="center" />
          <el-table-column label="狀態" width="120" align="center">
            <template #default="scope">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                <el-select v-model="scope.row.status" size="small" style="min-width: 100px">
                  <el-option label="顯示" value="published" />
                  <el-option label="不顯示" value="draft" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="編輯" width="80" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="刪除" width="80" align="center">
            <template #default="scope">
              <el-button link type="danger" @click="handleDelete(scope.row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Tablelist>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import Tablelist from '@/components/tablelist.vue'
  import { useNewStore } from '@/stores/new_store'

  const newStore = useNewStore()
  const router = useRouter()

  // 載入資料
  onMounted(() => {
    newStore.fetchnewData()
  })

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const searchText = ref('')
  const searchKey = ref('title')

  // 用 newStore.newData（不加 .value）
  const categoryOptions = computed(() => {
    const counts = {}
    newStore.newData.forEach((item) => {
      if (!item.category) return
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({ label: key, value: key, count }))
  })

  const filteredData = computed(() => {
    // 保持原有的 let data = [...newStore.newData]
    let data = [...newStore.newData]

    // *** 在這裡加上排序邏輯 ***
    // 根據日期進行降冪排序 (新 -> 舊)
    data.sort((a, b) => new Date(b.date) - new Date(a.date))

    // 後續的篩選邏輯保持不變
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => item.category === selectedCategory.value)
    }
    if (searchText.value.trim()) {
      const keyword = searchText.value.trim().toLowerCase()
      const key = searchKey.value
      data = data.filter((item) => {
        const field = item[key]
        return field?.toString().toLowerCase().includes(keyword)
      })
    }
    return data
  })
  watch([selectedCategory, searchText], () => {
    currentPage.value = 1
  })

  const handleAddNew = () => {
    router.push({ name: 'newadd' })
  }

  const handleEdit = (row) => {
    router.push({ name: 'newedit', params: { id: row.id } })
  }

  // 刪除資料
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('確定要刪除嗎？', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
      // 呼叫 Pinia store 的 deleteNews 方法來刪除資料
      newStore.deleteNews(row.id)

      ElMessage({
        type: 'success',
        message: '刪除成功！',
      })
    } catch (err) {
      console.log('取消刪除', err)
    }
  }
</script>

<style lang="scss" scoped>
  .page-container {
    width: 100%;
    box-sizing: border-box;
  }

  :deep(.el-select--small .el-select__wrapper) {
    font-size: 18px;
    height: 30px;
  }

  .el-select-dropdown__item {
    font-size: 18px;
  }

  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
