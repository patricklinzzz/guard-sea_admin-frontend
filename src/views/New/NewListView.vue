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
          <el-table-column prop="category_name" label="分類" width="120" align="center" />
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
                  v-if="scope.row.image_url"
                  :src="scope.row.image_url"
                  fit="cover"
                  style="width: 100%; height: 100%"
                />
                <span v-else style="color: #aaa">暫無圖片</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="標題" min-width="350" />
          <el-table-column prop="publish_date" label="日期" min-width="150" align="center" />
          <el-table-column label="狀態" width="120" align="center">
            <template #default="scope">
              <div
                style="display: flex; justify-content: center; align-items: center; height: 100%"
              >
                <el-select
                  v-model="scope.row.status"
                  size="small"
                  style="min-width: 100px"
                  @change="handleStatusChange(scope.row)"
                >
                  <el-option label="顯示" :value="1" />
                  <el-option label="不顯示" :value="0" />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="編輯" min-width="80" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="handleEdit(scope.row)">
                <el-icon><Edit /></el-icon>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="刪除" min-width="80" align="center">
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
    // 步驟一：計算每篇文章分類的數量，這部分保持不變
    const counts = {}
    newStore.newData.forEach((item) => {
      if (!item.category_id) return
      counts[item.category_id] = (counts[item.category_id] || 0) + 1
    })

    // 步驟二：遍歷分類列表，並將計算好的數量附加進去
    return newStore.categories.map((cat) => ({
      label: cat.category_name,
      value: cat.category_id,

      // 從 counts 物件中，根據當前分類的 ID (cat.category_id) 查找數量
      // 如果找不到 (例如某個分類下還沒有文章)，就給它一個預設值 0
      count: counts[cat.category_id] || 0,
    }))
  })

  const filteredData = computed(() => {
    // 保持原有的 let data = [...newStore.newData]
    let data = [...newStore.newData]

    // *** 在這裡加上排序邏輯 ***
    // 根據日期進行降冪排序 (新 -> 舊)
    data.sort((a, b) => new Date(b.publish_date) - new Date(a.publish_date))

    // 後續的篩選邏輯保持不變
    if (selectedCategory.value !== 'all') {
      data = data.filter((item) => item.category_id === selectedCategory.value)
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
    router.push({ name: 'newedit', params: { id: row.news_id } })
  }

  //讓列表頁顯示不顯示的狀態觸發能真正影響資料庫存放的狀態

  const handleStatusChange = async (row) => {
    // 這個 row 物件就是 Element Plus Table 傳過來的整筆資料，
    // 因為 v-model 的關係，row.status 此時已經是使用者選擇的新狀態了。

    //console.log(`準備更新 ID: ${row.news_id} 的狀態為: ${row.status}`)

    try {
      // 步驟 1: 建立一個 FormData 物件，準備發送到後端
      const formData = new FormData()

      // 步驟 2: 把必要資訊放進去。
      // 根據我們修改後的 path_new.php，它只需要知道要改哪一筆 (news_id)
      // 和要改哪個欄位 (status) 就夠了，非常高效！
      formData.append('news_id', row.news_id)
      formData.append('status', row.status)

      // 我們並不需要傳送 title, content 等其他欄位

      // 步驟 3: 呼叫 Pinia Store 中的 updateNews action
      await newStore.updateNews(formData)
    } catch (error) {
      // 如果 Pinia action 拋出錯誤 (例如網路中斷、API 報錯)
      //console.error('在列表頁更新狀態時失敗:', error)

      // 為了保持前端畫面和資料庫的資料一致性，
      // 更新失敗時，最簡單的方式是強制重新從伺服器獲取一次最新資料，
      // 這樣可以將剛剛在前端被改錯的狀態覆蓋回來。
      await newStore.fetchnewData(true)

      ElMessage.error('狀態更新失敗，已還原。')
    }
  }

  // 刪除資料
  const handleDelete = (row) => {
    // 1. 使用 ElMessageBox.confirm 詢問使用者
    ElMessageBox.confirm(
      `您確定要永久刪除消息「${row.title}」嗎？此操作無法復原。`, // 提示文字可以更明確
      '警告',
      {
        confirmButtonText: '確定刪除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(async () => {
        // 2. 當使用者點擊「確定刪除」後，這個 .then() 區塊會執行
        try {
          // 3. 在 try 區塊中，呼叫 store 的 action，並且「等待」它完成
          await newStore.deleteNews(row.news_id)

          // 4. 因為 store 內部成功時已經會顯示 ElMessage，
          //    所以元件本身不需要再顯示成功訊息，避免重複。
          //    如果 store 發生錯誤，會拋出 error，程式碼不會執行到這裡。
        } catch (error) {
          // 5. 如果 newStore.deleteNews() 內部發生任何錯誤 (網路、後端等)，
          //    這個 catch 會捕捉到它。
          //    store 內部已經用 ElMessage.error 提示了，
          //    這裡可以選擇性地在控制台留下更詳細的日誌，方便除錯。
          //console.error('在元件層捕捉到刪除失敗:', error)
        }
      })
      .catch(() => {
        // 6. 當使用者點擊「取消」或關閉對話框時，這個 .catch() 區塊會執行
        ElMessage({
          type: 'info',
          message: '已取消刪除操作',
        })
      })
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
