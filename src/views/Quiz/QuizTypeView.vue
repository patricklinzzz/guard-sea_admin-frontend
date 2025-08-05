<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import Tablelist from '@/components/tablelist.vue'

  const router = useRouter()

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const searchText = ref('')
  const allTableData = ref([])
  const searchKey = ref('title')
  const fetchError = ref(null)

  const editingState = ref(new Map())

  const fetchTableData = async () => {
    fetchError.value = null
    try {
      // 未來這裡直接換成 fetch或axios.get(url) 就行
      const fakeData = [
        {
          id: 1,
          title: '海洋生物',
          quiz_description: '探索深藍奧秘，守護海洋生物！',
          question_num: 10,
          pass_grade: 80,
        },
        {
          id: 2,
          title: '海洋污染',
          quiz_description: '揭開海洋污染真相，行動從我開始！',
          question_num: 10,
          pass_grade: 80,
        },
        {
          id: 3,
          title: '過度捕撈',
          quiz_description: '直面棲地危機，拯救海洋家園！',
          question_num: 10,
          pass_grade: 80,
        },
        {
          id: 4,
          title: '生態破壞',
          quiz_description: '測試你對過度捕撈的了解，守護海洋資源！',
          question_num: 10,
          pass_grade: 80,
        },
      ]

      // 模擬成功結果
      allTableData.value = fakeData
      return fakeData
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      console.error('Fetch 錯誤：', err)
      return []
    }
  }

  onMounted(fetchTableData)

  const categoryOptions = computed(() => {
    const counts = {}
    allTableData.value.forEach((item) => {
      if (!item.category) return
      counts[item.category] = (counts[item.category] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      label: key,
      value: key,
      count,
    }))
  })

  const filteredData = computed(() => {
    let data = [...allTableData.value]
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

  const handleEdit = (row) => {
    editingState.value.set(row.id, true)
    row.originalData = JSON.parse(JSON.stringify(row))
  }
  const handleCancel = (row) => {
    if (row.originalData) {
      Object.assign(row, row.originalData)
    }
    editingState.value.delete(row.id)
  }

  const handleSubmit = (row) => {
    // Your API call here...
    // Example of a fake API call
    setTimeout(() => {
      // API call success
      editingState.value.delete(row.id)
      row.originalData = null
      ElMessage({
        message: 'Quiz updated successfully!',
        type: 'success',
      })
    }, 500)
  }
</script>

<template>
  <div class="page-container">
    <Tablelist
      title="測驗類別管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      v-model:category="selectedCategory"
      v-model:searchTerm="searchText"
    >
      <template #default="scope">
        <!-- 這裡的 min-width 是觸發子元件滾動的條件 -->

        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="title" label="測驗標題" width="150" align="center">
            <template #default="{ row }">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ row.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="quiz_description" label="測驗描述" width="400" align="center">
            <template #default="{ row }">
              <div
                v-if="!editingState.has(row.id)"
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ row.quiz_description }}
              </div>
              <el-input v-else v-model="row.quiz_description" />
            </template>
          </el-table-column>
          <el-table-column prop="pass_grade" width="120" label="及格標準" align="center">
            <template #default="{ row }">
              <span v-if="!editingState.has(row.id)">{{ row.pass_grade }}%</span>
              <el-input-number
                v-else
                v-model.number="row.pass_grade"
                type="number"
                style="width: 50px"
                :controls="false"
                :min="0"
                :max="100"
                size="small"
              />
            </template>
          </el-table-column>

          <!-- 🐋 🐢 🌊 🐳 🦞 🐠 -->
          <el-table-column prop="question_num" label="題庫數量" width="120" align="center">
            <template #default="{ row }">
              <span v-if="!editingState.has(row.id)">{{ row.question_num }}</span>
              <el-input-number
                v-else
                v-model.number="row.question_num"
                type="number"
                style="width: 50px"
                :controls="false"
                :min="1"
                :max="20"
                size="small"
              />
            </template>
          </el-table-column>

          <el-table-column label="編輯" width="175" align="center">
            <template #default="{ row }">
              <div v-if="editingState.has(row.id)" width="200">
                <el-button type="default" @click="handleCancel(row)">取消</el-button>
                <el-button type="primary" @click="handleSubmit(row)">新增</el-button>
              </div>
              <div v-else>
                <el-button link type="primary" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Tablelist>
  </div>
</template>

<style lang="scss" scoped>
  /* 為父層容器設定樣式，確保它佔滿寬度 */
  .page-container {
    width: 100%;
    box-sizing: border-box;
  }

  :deep(.el-select--small .el-select__wrapper) {
    font-size: 18px;
    height: 30px;
  }

  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
