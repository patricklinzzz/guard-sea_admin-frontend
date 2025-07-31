<script setup>
import { reactive, ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'

const loginFormRef = ref(null)

const loginForm = reactive({
  username: '',
  password: '',
})

const loginRules = reactive({
  username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'blur' }],
})

const handleLogin = async () => {
  const formEl = loginFormRef.value
  if (!formEl) return
  try {
    await formEl.validate()
    console.log('submit!', loginForm)
    ElMessage.success('登入成功')
    // 在這裡處理實際的登入邏輯，例如呼叫 API
  } catch (error) {
    ElMessage.error('請檢查輸入的欄位')
  }
}
</script>

<template>
  <div class="login_container">
    <el-card class="login_card">
      <template #header>
        <div class="card_header">
          <span>系統登入</span>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-width="0px"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="帳號" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密碼" show-password :prefix-icon="Lock" size="large" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" class="login_button" size="large">登入</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login_card {
  width: 400px;

  .card_header {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .login_button {
    width: 100%;
  }
}
</style>
