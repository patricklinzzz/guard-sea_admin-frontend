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
            <el-table-column prop="id" label="會員編號" min-width="170" align="center" />
            <el-table-column prop="name" label="會員姓名" min-width="170" align="center" />
            <el-table-column prop="email" label="Email" min-width="200" />
            <el-table-column prop="phone" label="電話" min-width="180" align="center" />
            <el-table-column label="會員狀態" min-width="180" align="center">
              <template #default="scope">
                <el-select
                  :model-value="scope.row.status"
                  placeholder="選擇狀態"
                  style="width: 110px"
                >
                  <el-option label="啟用中" value="active"></el-option>
                  <el-option label="已停權" value="suspended"></el-option>
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
    <p class="dialog_member_name">姓名：{{ selectedMember?.name }}</p>
    <el-table
      :data="selectedMemberCoupons"
      v-if="selectedMemberCoupons.length > 0"
      class="coupon_dialog_table"
      max-height="40vh"
    >
      <el-table-column property="name" label="優惠券名稱" align="center" />
      <el-table-column property="status" label="狀態" align="center" />
      <el-table-column property="expiry_date" label="使用期限" align="center" />
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
  import { ref, computed } from 'vue'
  import TableList from '@/components/tablelist.vue'

  const currentPage = ref(1)
  const searchTerm = ref('')
  const dialogVisible = ref(false)
  const selectedMember = ref(null)
  const selectedMemberCoupons = ref([])

  const allMembers = ref([
    {
      id: '848900988',
      name: '王大陸',
      email: 'jay3234222@gmail.com',
      phone: '08839324311',
      status: 'active',
    },
    {
      id: '548330988',
      name: '陳零九',
      email: 'jay3234222@gmail.com',
      phone: '08839324311',
      status: 'active',
    },
    {
      id: '548330988',
      name: '陳大天',
      email: 'jay3234222@gmail.com',
      phone: '08839324311',
      status: 'active',
    },
    {
      id: '548330988',
      name: '大根',
      email: 'jay3234222@gmail.com',
      phone: '08839324311',
      status: 'active',
    },
    {
      id: '123456789',
      name: '林心如',
      email: 'ruby@example.com',
      phone: '0912345678',
      status: 'suspended',
    },
    {
      id: '987654321',
      name: '霍建華',
      email: 'wallace@example.com',
      phone: '0987654321',
      status: 'active',
    },
  ])

  const memberCouponsData = {
    848900988: [
      { name: '聰明回饋券', status: '可使用', expiry_date: '2025/08/08' },
      { name: '聰明回饋券', status: '已使用', expiry_date: '2024/07/05' },
      { name: '聰明回饋券', status: '已過期', expiry_date: '2025/06/20' },
      { name: '新人見面禮', status: '可使用', expiry_date: '2025/12/31' },
      { name: '生日祝福券', status: '可使用', expiry_date: '2025/10/10' },
      { name: '夏季特賣券', status: '已過期', expiry_date: '2023/08/31' },
      { name: '清倉折扣券', status: '可使用', expiry_date: '2025/09/15' },
      { name: '雙十一購物金', status: '可使用', expiry_date: '2025/11/11' },
      { name: '聖誕狂歡券', status: '已使用', expiry_date: '2024/12/25' },
      { name: '年度VIP回饋', status: '可使用', expiry_date: '2025/12/31' },
    ],
    548330988: [],
    123456789: [{ name: '停權安慰券', status: '已過期', expiry_date: '2023/01/01' }],
  }

  const filteredMembers = computed(() => {
    if (!searchTerm.value) return allMembers.value
    return allMembers.value.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  })

  const performSearch = () => {
    currentPage.value = 1
  }

  const handleViewCoupons = (member) => {
    selectedMember.value = member
    selectedMemberCoupons.value = memberCouponsData[member.id] || []
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
