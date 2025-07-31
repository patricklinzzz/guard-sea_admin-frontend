<template>
  <main>
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
      @search="performSearch"
    >
      <template #default="scope">
        <el-table :data="scope.data" stripe>
          <el-table-column prop="id" label="編號" width="80" />
          <el-table-column prop="category" label="分類" width="150" />
          <el-table-column label="封面圖" width="180">
            <template #default="scope">
              <div
                style="
                  width: 120px;
                  height: 80px;
                  border: 1px dashed #ccc;
                  background-color: #f5f5f5;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  cursor: pointer;
                "
                @click="triggerFileInput(scope.row)"
              >
                <template v-if="scope.row.cover">
                  <el-image :src="scope.row.cover" fit="cover" style="width: 100%; height: 100%" />
                </template>
                <template v-else>
                  <span style="font-size: 32px; color: #aaa; user-select: none">+</span>
                </template>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="title" label="標題" />
          <el-table-column prop="date" label="日期" width="180" />
          <el-table-column label="狀態" width="140">
            <template #default="scope">
              <el-select
                v-model="scope.row.status"
                @change="handleStatusChange(scope.row)"
                size="small"
                style="width: 100px"
              >
                <el-option label="顯示" value="published" />
                <el-option label="不顯示" value="draft" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="編輯" width="100" align="center">
            <template #default="scope">
              <el-button link type="primary">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="刪除" width="100" align="center">
            <template #default="scope">
              <el-button link type="danger">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </Tablelist>

    <!-- 上傳圖片用的 input -->
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      accept="image/*"
      @change="handleFileChange"
    />
  </main>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import Tablelist from '@/components/tablelist.vue'

  const currentPage = ref(1)
  const selectedCategory = ref('all')
  const searchText = ref('')
  const allTableData = ref([])
  const isLoading = ref(false)
  const fetchError = ref(null)
  const fileInput = ref(null)
  let currentRowForUpload = null

  const triggerFileInput = (row) => {
    currentRowForUpload = row
    fileInput.value?.click()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      currentRowForUpload.cover = reader.result
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const fetchTableData = async () => {
    isLoading.value = true
    fetchError.value = null
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      allTableData.value = [
        {
          id: 1,
          category: '品牌動態',
          cover: '',
          title: '徵才公告',
          date: '2025-07-09',
          status: 'published',
        },
        {
          id: 2,
          category: '優惠情報',
          cover: '',
          title: '潛水優惠',
          date: '2025-07-08',
          status: 'draft',
        },
        {
          id: 3,
          category: '活動花絮',
          cover: '',
          title: '淨灘圓滿',
          date: '2025-06-02',
          status: 'published',
        },
        {
          id: 4,
          category: '品牌動態',
          cover: '',
          title: '新品上架',
          date: '2025-07-07',
          status: 'published',
        },
        {
          id: 5,
          category: '優惠情報',
          cover: '',
          title: 'VIP 特惠',
          date: '2025-07-07',
          status: 'published',
        },
        {
          id: 6,
          category: '活動花絮',
          cover: '',
          title: '環保志工',
          date: '2025-07-07',
          status: 'published',
        },
        {
          id: 7,
          category: '優惠情報',
          cover: '',
          title: '折扣碼分享',
          date: '2025-07-07',
          status: 'published',
        },
      ]
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
    } finally {
      isLoading.value = false
    }
  }

  onMounted(fetchTableData)

  //  分類選單選項（來自全部資料，不受篩選影響）
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

  //  篩選後的資料（根據分類與關鍵字）
  const filteredData = computed(() => {
    let data = [...allTableData.value]
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => item.category === selectedCategory.value)
    }
    if (searchText.value.trim()) {
      const keyword = searchText.value.trim().toLowerCase()
      data = data.filter((item) => item.title.toLowerCase().includes(keyword))
    }
    return data
  })

  //  篩選條件變動 → 回到第一頁
  watch([selectedCategory, searchText], () => {
    currentPage.value = 1
  })

  const handleAddNew = () => {
    console.log('新增消息')
  }
  const performSearch = () => {
    console.log(`搜尋關鍵字: ${searchText.value}`)
  }
  const handleStatusChange = (row) => {
    console.log(`狀態變更為: ${row.status}`)
  }
</script>
