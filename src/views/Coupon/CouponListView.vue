<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { Edit } from '@element-plus/icons-vue'
  import { ElMessage } from 'element-plus'
  import { useCouponStore } from '@/stores/coupon_store'
  import Tablelist from '@/components/tablelist.vue'

  const couponStore = useCouponStore()

  const currentPage = ref(1)
  const searchText = ref('')
  const searchKey = ref('title')

  const editingCouponId = ref(null)
  const tempCoupon = ref({})
  const couponStatuses = ref({})

  onMounted(async () => {
    await couponStore.fetchCoupons()
    couponStore.coupons.forEach((coupon) => {
      couponStore.updateCoupon(coupon.id, { status: 'enabled' })
      couponStatuses.value[coupon.id] = 'enabled'
    })
  })

  const filteredData = computed(() => {
    if (couponStore.isLoading || !couponStore.coupons) {
      return []
    }
    let data = [...couponStore.coupons]

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

  const handleStatusChange = async (coupon, newStatus) => {
    const updatedFields = { status: newStatus }
    const success = await couponStore.updateCoupon(coupon.id, updatedFields)
    if (success) {
      ElMessage.success(
        `優惠券 ${coupon.id} 狀態已更新為 ${newStatus === 'enabled' ? '啟用' : '禁用'}`
      )
      couponStatuses.value[coupon.id] = newStatus
    } else {
      ElMessage.error('狀態更新失敗，請稍後再試。')
    }
  }

  const handleStartEdit = (row) => {
    if (editingCouponId.value) return
    editingCouponId.value = row.id
    tempCoupon.value = { ...row }
  }

  const handleCancelEdit = () => {
    editingCouponId.value = null
    tempCoupon.value = {}
  }

  const handleSaveEdit = async (row) => {
    const originalCoupon = couponStore.coupons.find((c) => c.id === row.id)

    if (
      originalCoupon.title === tempCoupon.value.title &&
      originalCoupon.valid_days === tempCoupon.value.valid_days &&
      originalCoupon.value === tempCoupon.value.value
    ) {
      ElMessage.info('優惠券內容沒有變動。')
      handleCancelEdit()
      return
    }

    const updatedFields = {
      title: tempCoupon.value.title,
      valid_days: tempCoupon.value.valid_days,
      value: tempCoupon.value.value,
    }

    const success = await couponStore.updateCoupon(row.id, updatedFields)
    if (success) {
      ElMessage.success('優惠券更新成功！')
    } else {
      ElMessage.error('更新失敗，請稍後再試。')
    }
    handleCancelEdit()
  }
</script>
<template>
  <div class="page-container">
    <Tablelist
      title="優惠券管理"
      :table-data="filteredData"
      :show-add-button="false"
      :show-category-filter="false"
      :show-search="false"
      :total="filteredData.length"
      :currentPage="1"
      :pageSize="10"
    >
      <el-table :data="filteredData" stripe style="width: 100%" v-loading="couponStore.isLoading">
        <el-table-column label="名稱" min-width="200">
          <template #default="{ row }">
            <el-input v-if="editingCouponId === row.id" v-model="tempCoupon.title" size="small" />
            <span v-else>{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column label="使用期限" width="200" align="center">
          <template #default="{ row }">
            <el-input
              v-if="editingCouponId === row.id"
              v-model.number="tempCoupon.valid_days"
              size="small"
              type="number"
            />
            <span v-else>{{ row.valid_days ? `${row.valid_days}天` : '沒有期限限制' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="面額" width="200" align="center">
          <template #default="{ row }">
            <el-input
              v-if="editingCouponId === row.id"
              v-model.number="tempCoupon.value"
              size="small"
              type="number"
            />
            <span v-else>${{ row.value }}</span>
          </template>
        </el-table-column>

        <el-table-column label="優惠代碼前綴" width="200" align="center">
          <template #default="{ row }">
            <span>{{ row.coupon_code_prefix }}</span>
          </template>
        </el-table-column>

        <el-table-column label="狀態" width="180" align="center">
          <template #default="{ row }">
            <el-select
              :model-value="couponStatuses[row.id]"
              @change="(newStatus) => handleStatusChange(row, newStatus)"
              size="small"
              :disabled="!!editingCouponId"
            >
              <el-option label="啟用" value="enabled" />
              <el-option label="停用" value="disabled" />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="編輯" width="150" align="center">
          <template #default="{ row }">
            <div v-if="editingCouponId === row.id" class="edit-actions">
              <el-button @click="handleCancelEdit">取消</el-button>
              <el-button type="warning" @click="handleSaveEdit(row)">儲存</el-button>
            </div>
            <el-button v-else link type="primary" @click="handleStartEdit(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </Tablelist>
  </div>
</template>

<style lang="scss" scoped>
  .page-container {
    width: 100%;
    box-sizing: border-box;

    .coupon-type-hint {
      display: inline-block;
      margin-bottom: 1rem;
      font-size: 1rem;
      color: #606266;
    }

    .edit-actions {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
    }

    :deep(.el-table) {
      .el-select--small {
        .el-select__wrapper {
          font-size: 1rem;
          height: 30px;
          min-width: 100px;
        }
      }

      .el-button.is-link {
        transform: scale(1.5);
      }
    }
  }
</style>
