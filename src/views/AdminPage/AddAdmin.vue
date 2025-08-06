<template>
  <h2 style="font-size: 24px;">新增管理員</h2>
  <el-form :model="form" label-width="auto" style="max-width: 600px" labelPosition="top">
    <el-form-item label="管理員編號">
      <el-input v-model="form.id" />
    </el-form-item>
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      prop="email"
      label="Email"
      :rules="[
        {
          required: true,
          message: '請輸入電子信箱',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: '請輸入正確的電子信箱',
          trigger: ['blur', 'change'],
        },
      ]"
    >
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label="電話">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item >
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useAdminStore } from '@/stores/admin_store'

  const router = useRouter()
  const adminStore = useAdminStore()

  const form = reactive({
    id: '',
    name: '',
    email: '',
    phone: '',
  })

  const handleSubmit = () => {
    adminStore.addAdmin({ ...form })
    ElMessage.success('新增管理員成功')
    router.push({ name: 'adminlist' })
  }

  const handleCancel = () => {
    router.push({ name: 'adminlist' })
  }
</script>

<style lang="scss" scoped></style>
