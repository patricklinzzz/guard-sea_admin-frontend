<template>
  <h2 style="font-size: 24px">新增管理員</h2>
  <el-form :model="form" label-width="auto" style="max-width: 600px" labelPosition="top" ref="formRef" autocomplete="off">
    <el-form-item label="管理員帳號">
      <el-input v-model="form.username" />
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
    <el-form-item label="管理員姓名">
      <el-input v-model="form.fullname" />
    </el-form-item>
    <el-form-item
      label="密碼"
      prop="password"
      :rules="[
        { required: true, message: '請輸入密碼', trigger: 'blur' },
        { validator: validatePassword, trigger: 'blur' },
      ]"
    >
      <el-input v-model="form.password" type="password" show-password autocomplete="new-password"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSubmit">新增</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useAdminStore } from '@/stores/admin_store'

  const router = useRouter()
  const adminStore = useAdminStore()
  const formRef = ref(null)

  const form = reactive({
    username: '',
    email: '',
    password: '',
    fullname: '',
  })

  //驗證密碼
  const validatePassword = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('請輸入密碼'))
    }
    // 至少 8 個字元
    if (value.length < 8) {
      return callback(new Error('密碼至少需8個字元'))
    }
    // 包含 1 個數字 (使用正則表達式)
    if (!/\d/.test(value)) {
      return callback(new Error('密碼需包含至少1個數字'))
    }
    // 包含 1 個特殊符號 (使用正則表達式，這裡定義一些常見的特殊符號)
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
      return callback(new Error('密碼需包含至少1個特殊符號'))
    }
    callback()
  }

  const handleSubmit = async () => {
    const isValid = await formRef.value.validate().catch(() => false)
    if (!isValid) {
      ElMessage.error('表單驗證失敗，請檢查輸入。')
      return
    }
    try {
      await adminStore.addAdmin({ ...form })
      ElMessage.success('新增管理員成功')
      router.push({ name: 'adminlist' })
    } catch (error) {
      console.error('新增管理員失敗:', error)
      ElMessage.error(error.message || '新增管理員失敗，請檢查網路或後端。')
    }
  }

  const handleCancel = () => {
    router.push({ name: 'adminlist' })
  }
</script>

<style lang="scss" scoped></style>
