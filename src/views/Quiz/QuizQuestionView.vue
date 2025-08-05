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

  const fetchTableData = async () => {
    fetchError.value = null
    try {
      // 未來這裡直接換成 fetch或axios.get(url) 就行
      const fakeData = [
        {
          question_id: 1,
          quiz_id: 1,
          question_description: '氣候變遷如何威脅綠蠵龜的族群平衡？',
          option_1: '改變其覓食地點',
          option_2: '增加牠們的天敵數量',
          option_3: '影響孵化溫度，導致性別失衡',
          answer: 3,
          explanation: '巢穴溫度升高會導致雌龜比例過高，影響族群繁衍。',
        },
        {
          question_id: 4,
          quiz_id: 1,
          question_description: '蘇眉魚族群難以從捕撈中恢復，主因是其何種特性？',
          option_1: '壽命短、繁殖快',
          option_2: '食物來源單一',
          option_3: '生長緩慢、性成熟晚',
          answer: 3,
          explanation: '蘇眉魚生長慢且性成熟晚，導致被捕後族群難以補充。',
        },
        {
          question_id: 6,
          quiz_id: 1,
          question_description: '綠蠵龜受塑膠垃圾威脅，主因常是？',
          option_1: '塑膠改變海水鹽度',
          option_2: '誤食塑膠袋或被漁網纏繞',
          option_3: '塑膠增加海底沉積物',
          answer: 2,
          explanation: '海龜常將塑膠誤認為食物吞食，或被廢棄漁具纏繞窒息。',
        },
        {
          question_id: 11,
          quiz_id: 2,
          question_description: '哪種污染物是海洋中最常見且持久的，對海洋生態造成廣泛威脅？',
          option_1: '有機廢物',
          option_2: '塑膠垃圾',
          option_3: '玻璃碎片',
          answer: 2,
          explanation: '塑膠因其極難分解的特性，是海洋中最主要的污染物。',
        },
        {
          question_id: 15,
          quiz_id: 2,
          question_description: '「幽靈漁具」對海洋環境的威脅是什麼？',
          option_1: '它們會發出噪音干擾海洋生物',
          option_2: '是廢棄或遺失的漁具，在海中持續捕殺生物',
          option_3: '它們會吸收海水中的氧氣',
          answer: 2,
          explanation: '被遺棄的漁網和漁線會持續在海中「捕魚」，造成大量海洋生物的意外死亡。',
        },
        {
          question_id: 21,
          quiz_id: 3,
          question_description: '什麼是造成全球漁業資源枯竭的首要原因？',
          option_1: '氣候變遷',
          option_2: '過度捕撈',
          option_3: '海洋污染',
          answer: 2,
          explanation:
            '過度捕撈是指捕魚速度快於魚類繁殖補充的速度，這是導致全球魚類資源枯竭的主因。',
        },
        {
          question_id: 31,
          quiz_id: 4,
          question_description: '哪項是海洋棲地破壞（如珊瑚礁、紅樹林、海草床）的最主要人為原因？',
          option_1: '自然地質變化',
          option_2: '沿海開發與填海造地',
          option_3: '深海採礦活動',
          answer: 2,
          explanation:
            '沿海地區的人口增長和基礎設施開發直接導致棲地被破壞或改變，是主要的人為因素。',
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

  const handleAddNew = () => {
    router.push({ name: 'q_add' })
  }

  const handleEdit = (row) => {
    //  router 有定義 path: '/news/edit/:id'，name: 'newsedit'
    router.push({ name: 'q_edit', params: { id: row.id } })
  }

  //刪除垃圾桶start

  //刪除垃圾桶end

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
        fakeDelete(row.id)
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
    allTableData.value = allTableData.value.filter((item) => item.id !== id)
  }
</script>

<template>
  <div class="page-container">
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
      :page-size="8"
    >
      <template #default="scope">
        <!-- 這裡的 min-width 是觸發子元件滾動的條件 -->

        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="question_description" label="題目" width="600" align="center">
            <template #default="{ row }">
              <div style="display: flex; height: 100%">
                {{ row.question_description }}
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="date" label="日期" width="150" align="center" /> -->

          <!-- <el-table-column label="狀態" width="120" align="center">
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
          </el-table-column> -->
          <el-table-column prop="answer" label="答案" width="300" align="center">
            <template #default="scope">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ scope.row.answer }}
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
