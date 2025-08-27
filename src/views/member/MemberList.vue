<template>
  <div class="member_management_container">
    <form @submit.prevent="performSearch">
      <TableList
        title="會員管理"
        :table-data="filteredMembers"
        :total="filteredMembers.length"
        v-model:current-page="currentPage"
        v-model:search-term="searchTerm"
        :show-search="true"
        search-placeholder="請輸入會員姓名"
        :page-size="10"
        @search="performSearch"
      >
        <template #default="{ data }">
          <el-table :data="data" style="width: 100%" class="member_list_table">
            <el-table-column prop="username" label="會員帳號" min-width="170" align="center" />
            <el-table-column prop="fullname" label="會員姓名" min-width="170" align="center" />
            <el-table-column prop="email" label="Email" min-width="200" />
            <el-table-column prop="phone_number" label="電話" min-width="180" align="center">
              <template #default="scope">
                {{ scope.row.phone_number || '無' }}
              </template>
            </el-table-column>
            <el-table-column label="會員狀態" min-width="180" align="center">
              <template #default="scope">
                <el-select
                  :model-value="scope.row.status"
                  placeholder="選擇狀態"
                  style="width: 110px"
                  @change="handleStatusChange(scope.row.member_id, $event)"
                >
                  <el-option label="啟用中" value="1"></el-option>
                  <el-option label="已停權" value="0"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="優惠券查詢" width="150" align="center">
              <template #default="scope">
                <el-button @click="handleViewCoupons(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </TableList>
    </form>
  </div>

  <el-dialog v-model="dialogVisible" title="會員優惠券查詢" width="700px" class="coupon_dialog">
    <p class="dialog_member_name">姓名：{{ selectedMember?.fullname }}</p>
    <el-table
      :data="selectedMemberCoupons"
      v-if="selectedMemberCoupons.length > 0"
      class="coupon_dialog_table"
      max-height="40vh"
    >
      <el-table-column property="title" label="優惠券名稱" align="center" />
      <el-table-column property="value" label="折扣金額" align="center" />
      <el-table-column property="expiration_date" label="使用期限" align="center" />
    </el-table>

    <p v-else>該會員目前沒有優惠券。</p>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">關閉</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
  import { ref, computed, onMounted } from 'vue'
  import TableList from '@/components/tablelist.vue'
  import axios from 'axios'

  const currentPage = ref(1)
  const searchTerm = ref('')
  const dialogVisible = ref(false)
  const selectedMember = ref(null)
  const selectedMemberCoupons = ref([])

  const allMembers = ref([])

  const baseUrl = import.meta.env.VITE_API_BASE

  onMounted(async () => {
    await fetchMembers()
  })

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${baseUrl}/members/get_members.php`)
      allMembers.value = response.data
    } catch (error) {
      //console.log(error)
    }
  }

  const filteredMembers = computed(() => {
    if (!searchTerm.value) return allMembers.value
    return allMembers.value.filter((m) =>
      m.fullname.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  const performSearch = () => {
    currentPage.value = 1
  }

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      const response = await axios.patch(`${baseUrl}/members/update_member_status.php`, {
        id: memberId,
        status: newStatus,
      })
      if (!response.data.success) {
        ElMessage.error(response.data.error || '管理員狀態更新失敗。')
      }
      await fetchMembers()
    } catch (error) {
      ElMessage.error(
        error.response?.data?.error || error.response?.data?.message || '發生未知錯誤，請重試。'
      )
    }
  }

  const handleViewCoupons = async (member) => {
    selectedMember.value = member
    try {
      const response = await axios.post(`${baseUrl}/members/get_member_coupons.php`, member)
      if (response.data.success) {
        selectedMemberCoupons.value = response.data.data
      } else {
        selectedMemberCoupons.value = []
      }
    } catch (error) {
      //console.error(error);
      selectedMemberCoupons.value = []
    }
    //console.log(selectedMemberCoupons.value);
    dialogVisible.value = true
  }
</script>
<style lang="scss" scoped>
  .member_management_container {
    width: 100%;
    // padding: 2rem
    box-sizing: border-box;
  }

  .coupon_dialog {
    :deep(.el-dialog__title) {
      display: block;
      text-align: center;
      font-size: 22px;
    }
  }

  .dialog_member_name {
    font-size: 18px;
    margin-bottom: 1.5rem;
    color: #333;
    text-align: center;
  }

  .coupon_dialog_table {
    :deep(.el-table__cell) {
      border: 1px solid #e0e6ed;
      padding: 16px 0;
      font-size: 15px;
    }

    :deep(td.el-table__cell),
    :deep(th.el-table__cell.is-leaf) {
      border-bottom: 1px solid #e0e6ed;
    }

    &::before {
      height: 0;
    }

    :deep(.el-table__header th.el-table__cell) {
      background-color: #ffffff !important;
      color: #303133;
      font-weight: 500;
    }
  }
</style>
