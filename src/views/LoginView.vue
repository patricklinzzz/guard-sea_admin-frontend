<script setup>
  import { reactive, ref } from 'vue'
  import { User, Lock } from '@element-plus/icons-vue'
  import logo from '@/assets/images/logo.svg'
  import { useAuthStore } from '@/stores/auth'

  const loginFormRef = ref(null)
  const loading = ref(false)
  const authStore = useAuthStore()

  const loginForm = reactive({
    username: '',
    password: '',
  })

  const validatePassword = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('請輸入密碼'))
    }
    if (value.length < 8 || !/\d/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return callback(new Error('密碼格式不符'))
    }
    callback()
  }

  const loginRules = reactive({
    username: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
    password: [{ validator: validatePassword, trigger: 'blur' }],
  })

  const handleLogin = async () => {
    if (loading.value) return
    const formEl = loginFormRef.value
    if (!formEl) return
    try {
      await formEl.validate()
      loading.value = true
      await authStore.login(loginForm)
    } catch (validationError) {
      console.log('Form validation failed:', validationError)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="login_container">
    <el-card class="login_card">
      <template #header>
        <div class="card_header">
          <img class="logo_img" :src="logo" alt="系統 Logo" />
          <h2 class="title">後台登入</h2>
        </div>
      </template>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        label-position="top"
        label-width="auto"
        :hide-required-asterisk="true"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username" label="管理員帳號">
          <el-input v-model="loginForm.username" :prefix-icon="User" size="large" />
        </el-form-item>
        <el-form-item prop="password" label="密碼">
          <el-input
            v-model="loginForm.password"
            type="password"
            show-password
            :prefix-icon="Lock"
            size="large"
          />
          <div class="password-hint">請使用至少 8 個字元，且包含 1 個數字與 1 個特殊符號</div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            class="login_button"
            size="large"
            :loading="loading"
            :disabled="loading"
          >
            登入
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
  .login_container {
    width: 100vw;
    background-color: v.$color-blue-dark;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .login_card {
    width: 400px;
    :deep(.el-card__header) {
      border-bottom: none;
      padding-bottom: 10px;
    }
    .card_header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 12px;
      .logo_img {
        height: 2em;
      }
      .title {
        margin: 0;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .login_button {
      width: 100%;
    }
    .password-hint {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
      line-height: 1.2;
    }
  }
</style>
