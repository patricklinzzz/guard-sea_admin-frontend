<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useOrderStore } from '@/stores/order_store'
  import Tablelist from '@/components/tablelist.vue'

  const router = useRouter()
  const orderStore = useOrderStore()

  const currentPage = ref(1)
  const selectedStatus = ref('all')
  const searchText = ref('')
  const searchKey = ref('id')

  const editingOrderId = ref(null)

  const tempNotesMap = ref({})

  onMounted(() => {
    orderStore.fetchOrders()
  })

  const statusOptions = computed(() => {
    const counts = {}
    orderStore.orders.forEach((item) => {
      counts[item.status] = (counts[item.status] || 0) + 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      label: key,
      value: key,
      count,
    }))
  })

  const filteredData = computed(() => {
    let data = [...orderStore.orders]
    if (selectedStatus.value !== 'all') {
      data = data.filter((item) => item.status === selectedStatus.value)
    }
    if (searchText.value.trim()) {
      const keyword = searchText.value.trim().toLowerCase()
      data = data.filter((item) => {
        const field = item[searchKey.value]
        return field?.toString().toLowerCase().includes(keyword)
      })
    }
    return data
  })

  const handleStatusChange = async (order, newStatus) => {
    if (editingOrderId.value === order.id) return
    await orderStore.updateOrderStatus(order.id, newStatus)
    ElMessage.success(`訂單 ${order.id} 狀態已更新為 ${newStatus}`)
  }

  const goToDetail = (row) => {
    router.push({ name: 'orderdetail', params: { id: row.id } })
  }

  const handleStartEdit = (row) => {
    if (editingOrderId.value) return

    editingOrderId.value = row.id
    tempNotesMap.value[row.id] = row.notes
  }

  const handleCancelEdit = () => {
    const id = editingOrderId.value
    if (id) {
      delete tempNotesMap.value[id]
    }
    editingOrderId.value = null
  }

  const handleSaveEdit = async (row) => {
    const newNote = tempNotesMap.value[row.id]
    if (newNote === row.notes) {
      ElMessage.info('備註內容沒有變動。')
      handleCancelEdit()
      return
    }

    const success = await orderStore.updateOrderNotes(row.id, newNote)
    if (success) {
      ElMessage.success('備註更新成功！')
    } else {
      ElMessage.error('備註更新失敗，請稍後再試。')
    }
    handleCancelEdit()
  }
</script>

<template>
  <div class="page-container">
    <Tablelist
      title="訂單管理"
      :total="filteredData.length"
      v-model:currentPage="currentPage"
      :table-data="filteredData"
      :category-options="statusOptions"
      :show-add-button="false"
      :show-category-filter="true"
      v-model:category="selectedStatus"
      :show-search="true"
      search-placeholder="請輸入訂單編號關鍵字"
      v-model:searchTerm="searchText"
      :search-key="searchKey"
      all-label="全部狀態"
    >
      <template #default="scope">
        <el-table :data="scope.data" stripe style="width: 100%">
          <el-table-column prop="id" label="訂單編號" width="200" />
          <el-table-column prop="orderDate" label="訂單日期" width="180" align="center" />
          <el-table-column label="訂單狀態" width="130" align="center">
            <template #default="scope">
              <el-select
                :model-value="scope.row.status"
                @change="(newStatus) => handleStatusChange(scope.row, newStatus)"
                size="small"
                :disabled="editingOrderId === scope.row.id"
              >
                <el-option label="處理中" value="處理中" />
                <el-option label="已出貨" value="已出貨" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="訂購人" width="100" align="center" />
          <el-table-column label="合計" width="120" align="center">
            <template #default="scope">${{ scope.row.total.toLocaleString() }}</template>
          </el-table-column>

          <el-table-column label="訂單詳情" width="120" align="center">
            <template #default="scope">
              <el-button link type="primary" @click="goToDetail(scope.row)">>></el-button>
            </template>
          </el-table-column>

          <el-table-column label="備註" min-width="150">
            <template #default="scope">
              <el-input
                v-if="editingOrderId === scope.row.id"
                v-model="tempNotesMap[scope.row.id]"
                size="small"
                @keyup.enter="handleSaveEdit(scope.row)"
                :placeholder="scope.row.notes || '點此新增備註'"
              />
              <span v-else>{{ scope.row.notes || '無' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="編輯" width="150" align="center">
            <template #default="scope">
              <div v-if="editingOrderId === scope.row.id" class="edit-actions">
                <el-button @click="handleCancelEdit">取消</el-button>
                <el-button type="warning" @click="handleSaveEdit(scope.row)">儲存</el-button>
              </div>
              <el-button
                v-else
                link
                type="primary"
                @click="handleStartEdit(scope.row)"
                title="編輯備註"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
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
  .el-button.is-link  {
    font-size: 18px;
  }

  .edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .el-button {
    white-space: nowrap;
  }
</style>
