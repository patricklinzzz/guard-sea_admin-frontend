<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import Tablelist from '@/components/tablelist.vue'
  import axios from 'axios'

  const router = useRouter()

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const searchText = ref('')
  const allTableData = ref([])
  const fetchError = ref(null)
  const baseUrl = import.meta.env.VITE_API_BASE

  const editingState = ref(new Map())
  const hasError = ref([])
  const fetchTableData = async () => {
    fetchError.value = null
    try {
      const quiz_api = `${baseUrl}/quiz/get_quiz.php`
      const num_api = `${baseUrl}/quiz/get_question_num.php`
      const qr = await axios.get(quiz_api)
      const nr = await axios.get(num_api)
      allTableData.value = qr.data.map((quiz) => ({
        ...quiz,
        quiz_id: Number(quiz.quiz_id),
        question_num: Number(quiz.question_num),
        pass_grade: Number(quiz.pass_grade),
        num: Number(nr.data[quiz.quiz_id - 1].num),
      }))
      hasError.value = nr.data.map((quiz) => ({
        quiz_description: false,
        pass_grade: false,
        num: false,
      }))
      console.log(allTableData.value)
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      console.error('Fetch 錯誤：', err)
    }
  }

  onMounted(fetchTableData)

  watch([selectedCategory, searchText], () => {
    currentPage.value = 1
  })
  const resetError = (row_i) => {
    Object.keys(hasError.value[row_i]).forEach((key) => {
      hasError.value[row_i][key] = false
    })
  }
  const handleEdit = (row) => {
    console.log(hasError.value)
    editingState.value.set(row.quiz_id, true)
    row.originalData = JSON.parse(JSON.stringify(row))
  }
  const handleCancel = (row) => {
    if (row.originalData) {
      Object.assign(row, row.originalData)
    }
    editingState.value.delete(row.quiz_id)
    resetError(row.quiz_id - 1)
  }

  const handleSubmit = async (row) => {
    console.log(row)
    const row_i = row.quiz_id - 1
    let error = false
    if (row.quiz_description.trim() === '') {
      hasError.value[row_i].quiz_description = true
      ElMessage({
        message: '題目不可空白!',
        type: 'error',
      })
      error = true
    } else hasError.value[row_i].quiz_description = false

    if (row.pass_grade < 10 || row.pass_grade > 100) {
      hasError.value[row_i].pass_grade = true
      ElMessage({
        message: '分數標準至少10%，至多100%!',
        type: 'error',
      })
      error = true
    } else hasError.value[row_i].pass_grade = false

    if (row.question_num < 1 || row.question_num > 20) {
      hasError.value[row_i].num = true
      ElMessage({
        message: '題目至少1題，至多20題!',
        type: 'error',
      })
      error = true
    } else if (row.question_num > allTableData.value[row_i].num) {
      hasError.value[row_i].num = true
      ElMessage({
        message: `題庫數量不足! 當前題目數量: ${allTableData.value[row_i].num}`,
        type: 'error',
      })
      error = true
    } else hasError.value[row_i].num = false

    if (error) return

    try {
      const apiUrl = `${baseUrl}/quiz/patch_quiz.php`
      const response = await axios.patch(apiUrl, row)
      console.log('Quiz edit successfully:', response.data)
    } catch (err) {
      console.error('Post Error:', err)
    }

    setTimeout(() => {
      // API call success
      editingState.value.delete(row.quiz_id)
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
      :total="allTableData.length"
      v-model:currentPage="currentPage"
      :table-data="allTableData"
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
                v-if="!editingState.has(row.quiz_id)"
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ row.quiz_description }}
              </div>
              <div v-else>
                <el-input
                  v-model="row.quiz_description"
                  :class="{ 'is-error': hasError[row.quiz_id - 1].quiz_description }"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pass_grade" width="120" label="及格標準" align="center">
            <template #default="{ row }">
              <span v-if="!editingState.has(row.quiz_id)">{{ row.pass_grade }}%</span>
              <el-input-number
                v-else
                v-model.number="row.pass_grade"
                :class="{ 'is-error': hasError[row.quiz_id - 1].pass_grade }"
                type="number"
                style="width: 50px"
                :controls="false"
                size="small"
              />
            </template>
          </el-table-column>

          <!-- 🐋 🐢 🌊 🐳 🦞 🐠 -->
          <el-table-column prop="question_num" label="題庫數量" width="120" align="center">
            <template #default="{ row }">
              <span v-if="!editingState.has(row.quiz_id)">{{ row.question_num }}</span>
              <el-input-number
                v-else
                v-model.number="row.question_num"
                :class="{ 'is-error': hasError[row.quiz_id - 1].num }"
                type="number"
                style="width: 50px"
                :controls="false"
                size="small"
              />
            </template>
          </el-table-column>

          <el-table-column label="編輯" width="175" align="center">
            <template #default="{ row }">
              <div v-if="editingState.has(row.quiz_id)" width="200">
                <el-button type="default" @click="handleCancel(row)">取消</el-button>
                <el-button type="primary" @click="handleSubmit(row)">儲存</el-button>
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
  :deep(.el-input.is-error .el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
  }

  :deep(.el-input-number.is-error .el-input__wrapper) {
    box-shadow: 0 0 0 1px var(--el-color-danger) inset;
  }
</style>
