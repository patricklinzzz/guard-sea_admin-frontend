<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import Tablelist from '@/components/tablelist.vue'
  import { useQuizStore } from '@/stores/quiz_store'

  const router = useRouter()
  const quizStore = useQuizStore()

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const searchText = ref('')
  const fetchError = ref(null)
  const loading = ref(true)

  const categoryOptions = computed(() => {
    const counts = {}
    quizStore.quizzes.forEach((item) => {
      if (!item.quiz_id) return
      counts[item.quiz_id] = (counts[item.quiz_id] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      label: quizStore.quiz_map[key],
      value: key,
      count,
    }))
  })

  const filteredData = computed(() => {
    console.log(quizStore.quizzes.length)
    let data = [...quizStore.quizzes]
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => item.quiz_id == selectedCategory.value)
    }
    return data
  })

  watch([selectedCategory, searchText], () => {
    currentPage.value = 1
  })

  const handleAddNew = () => {
    router.push({ name: 'q_add' })
  }

  const handleEdit = (row) => {
    router.push({ name: 'q_edit', params: { id: row.question_id } })
  }

  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('確定要刪除嗎？', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      // 這是模擬刪除，之後這裡可以改成 await axios.delete(`/api/news/${row.id}`)

      // 模擬延遲
      setTimeout(() => {
        fakeDelete(row.question_id)
        ElMessage({
          type: 'success',
          message: '刪除成功！',
        })
      }, 500) // 延遲刪除
    } catch (err) {
      // 使用者點了「取消」就什麼都不做
      console.log('取消刪除', err)
    }
  }

  const fakeDelete = (id) => {
    quizStore.deleteQuestionToQuiz(id)
    // quizStore.quizzes.filter((item) => item.question_id != id)
  }

  onMounted(async () => {
    loading.value = true
    try {
      await quizStore.fetchAllQuizzes()
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div v-if="loading">⏳ 載入中...</div>
  <div v-else-if="!quizStore.isInitialized">❌ 找不到該筆資料，請返回列表頁。</div>
  <div v-else class="page-container">
    <Tablelist
      title="測驗題目管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      :show-add-button="true"
      add-button-text="+ 新增題目"
      @add="handleAddNew"
      :show-category-filter="true"
      v-model:category="selectedCategory"
      all-label="全部題目"
      :page-size="7"
    >
      <template #default="scope">
        <el-table :data="scope.data" prop="quiz_id" stripe style="width: 100%">
          <el-table-column prop="question_description" label="題目" width="600" align="center">
            <template #default="{ row }">
              <div style="display: flex; height: 100%">
                {{ row.question_description }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="answer" label="答案" width="300" align="center">
            <template #default="{ row }">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ row[`option_${row.answer}`] }}
              </div>
            </template>
          </el-table-column>

          <el-table-column label="編輯" width="80" align="center">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>

          <el-table-column label="刪除" width="80" align="center">
            <template #default="{ row }">
              <el-button link type="danger" @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
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

  .el-select-dropdown__item {
    font-size: 18px;
  }

  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
