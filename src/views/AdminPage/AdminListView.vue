<template>
  <tablelist
    title="管理員設定"
    :tableData="filteredData"
    :showAddButton="true"
    :showSearch="true"
    addButtonText="+ 新增管理員"
    searchPlaceholder="請輸入員工姓名"
    :search-key="searchKey"
    v-model:searchTerm="searchText"
    :total="filteredData.length"
    @add="handleAddNew"
    v-model:currentPage="currentPage"
  >
    <template #default="{ data }">
      <el-table :data="data" style="width: 100%">
        <el-table-column prop="id" label="員工編號" width="120" />
        <el-table-column prop="name" label="姓名" width="160" />
        <el-table-column prop="email" label="Email" width="280" />
        <el-table-column prop="phone" label="電話" width="160" />
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
  const adminStore = useAdminStore()

  const currentPage = ref(1)
  const searchText = ref('')
  const searchKey = ref('name')

  const filteredData = computed(() => {
    let data = [...adminStore.admins]
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
    router.push({ name: 'adminedit', params: { id: row.id } })
  }
</script>

<style lang="scss" scoped>
  .el-button.is-link {
    transform: scale(1.7);
  }
</style>
