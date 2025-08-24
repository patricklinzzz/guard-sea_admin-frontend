<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import Tablelist from '@/components/tablelist.vue'
import { useEventStore } from '@/stores/event_store'

const eventStore = useEventStore()
const router = useRouter()
const backendUpdateUrl = 'http://localhost:8888/guard-sea_api/events/update_event_status.php';

// 頁面狀態
const currentPage = ref(1)
const selectedCategory = ref('all')
const searchText = ref('')
const searchKey = ref('title')

// 獲取並處理活動資料
onMounted(async () => {
  await eventStore.fetchEventData()
})

const categoryOptions = computed(() => {
  const counts = {}
  eventStore.eventData.forEach((item) => {
    if (!item.category) return
    counts[item.category] = (counts[item.category] || 0) + 1
  })
  return Object.entries(counts).map(([key, count]) => ({ label: key, value: key, count }))
})

const filteredData = computed(() => {
  let data = [...eventStore.eventData]
  data.sort((a, b) => new Date(b.eventDate[0]) - new Date(a.eventDate[0]))

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

// 路由跳轉處理
const handleAddEvent = () => {
  router.push({ name: 'eventAdd' })
}

const handleEdit = (row) => {
  router.push({ name: 'eventEdit', params: { id: row.id } })
}

const handleeventMember = (row) => {
  router.push({ name: 'eventMember', params: { id: row.id } })
}

// 格式化日期
const formatDateRange = (dateRange) => {
  if (!Array.isArray(dateRange) || dateRange.length < 2) return '日期格式錯誤'
  const startDate = new Date(dateRange[0])
  const endDate = new Date(dateRange[1])
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return '日期格式錯誤'

  const y = startDate.getFullYear()
  const m = String(startDate.getMonth() + 1).padStart(2, '0')
  const d = String(startDate.getDate()).padStart(2, '0')
  const startHH = String(startDate.getHours()).padStart(2, '0')
  const startMM = String(startDate.getMinutes()).padStart(2, '0')
  const endHH = String(endDate.getHours()).padStart(2, '0')
  const endMM = String(endDate.getMinutes()).padStart(2, '0')

  return `${y}.${m}.${d} ${startHH}:${startMM}-${endHH}:${endMM}`
}

// 處理狀態變更的核心函式
const handleStatusChange = async (eventId, newStatus) => {
    try {
        const response = await axios.post(backendUpdateUrl, {
            id: eventId,
            status: newStatus,
        });

        if (response.data.status === 'success') {
            ElMessage.success('活動狀態更新成功！');
        } else {
            ElMessage.error(`更新失敗: ${response.data.message}`);
        }
    } catch (err) {
        console.error('更新活動狀態錯誤:', err);
        ElMessage.error('更新失敗，請檢查網路或稍後再試。');
        
        // 如果 API 呼叫失敗，重新載入整個列表以還原狀態
        await eventStore.fetchEventData();
    }
};
</script>

<template>
  <div class="page-container">
    <Tablelist
      title="活動管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      :show-add-button="true"
      add-button-text="+ 新增活動"
      @add="handleAddEvent"
      :show-category-filter="true"
      v-model:category="selectedCategory"
      :show-search="true"
      search-placeholder="請輸入活動名稱"
      v-model:searchTerm="searchText"
      :search-key="searchKey"
      all-label="全部活動"
      :page-size="5"
    >
      <template #default="scope">
        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="title" label="活動名稱" min-width="180" />
          <el-table-column prop="category" label="活動分類" min-width="120" align="center" />
          <el-table-column prop="deadline" label="報名截止" min-width="140" align="center" />
          <el-table-column label="活動日期" min-width="180" align="center">
            <template #default="scope">
              {{ formatDateRange(scope.row.eventDate) }}
            </template>
          </el-table-column>
          <el-table-column prop="presenter" label="主講人" min-width="120" align="center" /> <!-- 新增主講人欄位 -->
          <el-table-column prop="quota" label="名額" min-width="80" align="center" />
          <el-table-column label="名單查詢" min-width="120" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleeventMember(scope.row)">>></el-button>
            </template>
          </el-table-column>
          <el-table-column label="編輯" min-width="80" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="狀態" min-width="120" align="center">
            <template #default="scope">
              <el-select 
                v-model="scope.row.status" 
                size="small" 
                style="min-width: 100px"
                @change="handleStatusChange(scope.row.id, scope.row.status)"
              >
                <el-option label="報名中" value="open" />
                <el-option label="報名截止" value="closed" />
                <el-option label="已結束" value="finished" />
                <el-option label="已取消" value="cancelled" />
              </el-select>
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

:deep(.el-select--small .el-select__wrapper) {
  font-size: 16px;
  height: 30px;
}

.el-select-dropdown__item {
  font-size: 16px;
}

.el-button.is-link {
  transform: scale(1.5);
}
</style>