<template>
  <tablelist
    title="管理員設定"
    :tableData="filteredData"
    :showAddButton="true"
    :showSearch="true"
    addButtonText="+ 新增管理員"
    searchPlaceholder="請輸入管理員帳號"
    :search-key="searchKey"
    v-model:searchTerm="searchText"
    :total="filteredData.length"
    @add="handleAddNew"
    v-model:currentPage="currentPage"
    :page-size="10"
  >
    <template #default="{ data }">
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="administrator_id" label="管理員編號" min-width="130" />
        <el-table-column prop="username" label="管理員帳號" min-width="130" />
        <el-table-column prop="email" label="Email" min-width="160" />
        <el-table-column prop="fullname" label="管理員姓名" min-width="160" />
        <el-table-column label="管理員狀態" min-width="180" align="center">
          <template #default="scope">
            <el-select :model-value="scope.row.status" placeholder="選擇狀態" style="width: 110px" @change="handleStatusChange(scope.row.administrator_id,$event)">
              <el-option label="啟用中" value="1"></el-option>
              <el-option label="已停權" value="0"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="編輯" width="80" align="center">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </tablelist>
</template>

<script setup>
  import tablelist from '@/components/tablelist.vue'
  import { ref, computed, watch } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { useAdminStore } from '@/stores/admin_store'

  const router = useRouter()
  const admin = useAdminStore()
  admin.fetchAdmins()

  const currentPage = ref(1)
  const searchText = ref('')
  const searchKey = ref('username')

  const filteredData = computed(() => {
    let data = [...admin.admins]
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

  watch([searchText], () => {
    currentPage.value = 1
  })

  const handleAddNew = () => {
    router.push({ name: 'adminadd' })
  }

  const handleEdit = (row) => {
    router.push({ name: 'adminedit', params: { id: row.administrator_id } })
  }

  const handleStatusChange = async (adminId,newStatus)=>{
    await admin.updateAdminStatus(adminId,newStatus)
  }
</script>

<style lang="scss" scoped>
  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
