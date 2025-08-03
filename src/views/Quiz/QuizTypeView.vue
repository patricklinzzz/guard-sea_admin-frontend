<template>
  <div class="page-container">
    <Tablelist
      title="測驗類別管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="categoryOptions"
      :show-add-button="false"
      add-button-text="+ 新增消息"
      @add="handleAddNew"
      :show-category-filter="false"
      v-model:category="selectedCategory"
      :show-search="false"
      search-placeholder="請輸入標題關鍵字"
      v-model:searchTerm="searchText"
      :search-key="searchKey"
      all-label="全部題目"
      :page-size="8"
    >
      <template #default="scope">
        <!-- 這裡的 min-width 是觸發子元件滾動的條件 -->

        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="category" label="類別" width="200" align="center">
            <template #default="scope">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                {{ scope.row.category }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="question" label="測驗標題" width="600" />
          <!-- <el-table-column prop="date" label="日期" width="150" align="center" /> -->
          <el-table-column prop="passScore" label="及格標準" align="center">
            <template #default="scope">
              <span v-if="!scope.row.editable">{{ scope.row.passScore }}</span>
              <el-input-number
                v-else
                v-model="scope.row.passScore"
                :min="0"
                :max="100"
                size="small"
              />
            </template>
          </el-table-column>

          <!-- 🐋 🐢 🌊 題庫數量邏輯還沒寫 🐳 🦞 🐠 -->
          <!-- <el-table-column label="題庫數量" align="center">
            <template #default="scope">
              {{ questionCountMap[scope.row.category] || 0 }}
            </template>
          </el-table-column> -->

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
          id: 1,
          category: '海洋生物',
          question: '蘇眉魚族群驟減，除過度捕撈外，主要因何種漁法？',
          answer: '氰化物或炸魚等破壞性漁法',
          passScore: '88',
        },
        {
          id: 2,
          category: '海洋污染',
          question:
            '藍鯨是地球上體型最大的動物，過去曾因大規模商業捕鯨活動導致數量銳減。目前，IUCN紅色名錄將藍鯨列為哪個瀕危等級？',
          answer: '過度捕撈',
          passScore: '88',
        },
        {
          id: 3,
          category: '生態破壞',
          question: '氣候變遷導致的哪兩種現象對全球珊瑚礁的破壞最大？',
          answer: '作為幼魚和無脊椎動物的育兒所與重要的碳匯',
          passScore: '99',
        },

        {
          id: 4,
          category: '過度捕撈',
          question: '什麼是造成全球漁業資源枯竭的首要原因？',
          answer: '過度捕撈',
          passScore: '88',
        },
        {
          id: 5,
          category: '過度捕撈',
          question: '什麼是造成全球漁業資源枯竭的首要原因？',
          answer: '瀕危（Endangered, EN）',
          passScore: '88',
        },
        {
          id: 6,
          category: '過度捕撈',
          question: '什麼是造成全球漁業資源枯竭的首要原因？',
          answer: '瀕危（Endangered, EN）',
          passScore: '68',
        },
        {
          id: 7,
          category: '過度捕撈',
          question: '什麼是造成全球漁業資源枯竭的首要原因？',
          answer: '瀕危（Endangered, EN）',
          passScore: '68',
        },
        {
          id: 8,
          category: '海洋生物',
          question: '蘇眉魚族群驟減，除過度捕撈外，主要因何種漁法？',
          answer: '氰化物或炸魚等破壞性漁法',
          passScore: '88',
        },
        {
          id: 9,
          category: '海洋生物',
          question: '什麼是造成全球漁業資源枯竭的首要原因？',
          answer: '氰化物或炸魚等破壞性漁法',
          passScore: '88',
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
    router.push({ name: 'newadd' })
  }

  const handleEdit = (row) => {
    //  router 有定義 path: '/news/edit/:id'，name: 'newsedit'
    router.push({ name: 'newedit', params: { id: row.id } })
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
