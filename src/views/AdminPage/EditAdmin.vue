<template>
  <h2 style="font-size: 24px">編輯管理員</h2>
  <el-form
    v-if="form"
    :model="form"
    label-width="auto"
    style="max-width: 600px"
    labelPosition="top"
  >
    <el-form-item label="管理員編號">
      <el-input v-model="form.administrator_id" disabled />
    </el-form-item>

    <el-form-item label="管理員帳號">
      <el-input v-model="form.username" />
    </el-form-item>

    <el-form-item
      prop="email"
      label="Email"
      :rules="[
        { required: true, message: '請輸入電子信箱', trigger: 'blur' },
        { type: 'email', message: '請輸入正確的電子信箱', trigger: ['blur', 'change'] },
      ]"
    >
      <el-input v-model="form.email" />
    </el-form-item>

    <el-form-item label="姓名">
      <el-input v-model="form.fullname" />
    </el-form-item>

    <el-form-item>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">更新</el-button>
    </el-form-item>
  </el-form>
  <div v-else>
    <p>找不到該管理員資料...</p>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useAdminStore } from '@/stores/admin_store'

  const route = useRoute()
  const router = useRouter()
  const adminStore = useAdminStore()

  const form = ref(null)

  onMounted(() => {
    const adminId = route.params.id
    const adminData = adminStore.getAdminById(adminId)
    if (adminData) {
      // 建立一個響應式副本以供表單編輯，避免直接修改 store 狀態
      form.value = { ...adminData }
    }
  })

  const handleSubmit = () => {
    adminStore.updateAdmin(form.value)
    ElMessage.success('管理員資料更新成功')
    router.push({ name: 'adminlist' })
  }

  const handleCancel = () => {
    router.push({ name: 'adminlist' })
  }
</script>

<style lang="scss" scoped></style>
