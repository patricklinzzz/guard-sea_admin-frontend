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
  const fetchTableData = async () => {
    fetchError.value = null
    try {
      const apiUrl = `${baseUrl}/quiz/get_quiz.php`
      const response = await axios.get(apiUrl)
      allTableData.value = response.data
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      console.error('Fetch 錯誤：', err)
    }
  }

  onMounted(fetchTableData)

  watch([selectedCategory, searchText], () => {
    currentPage.value = 1
  })

  const handleEdit = (row) => {
    editingState.value.set(row.quiz_id, true)
    row.originalData = JSON.parse(JSON.stringify(row))
  }
  const handleCancel = (row) => {
    if (row.originalData) {
      Object.assign(row, row.originalData)
    }
    editingState.value.delete(row.quiz_id)
  }

  const handleSubmit = async (row) => {
    try {
      const apiUrl = `${baseUrl}/quiz/patch_quiz.php`
      const response = await axios.patch(apiUrl, row)
      console.log('Quiz edit successfully:', response.data)
    } catch (err) {
      console.error('Post Error:', err)
    }

    // Your API call here...
    // Example of a fake API call
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
              <el-input v-else v-model="row.quiz_description" />
            </template>
          </el-table-column>
          <el-table-column prop="pass_grade" width="120" label="及格標準" align="center">
            <template #default="{ row }">
              <span v-if="!editingState.has(row.quiz_id)">{{ row.pass_grade }}%</span>
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
              <span v-if="!editingState.has(row.quiz_id)">{{ row.question_num }}</span>
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
</style>
