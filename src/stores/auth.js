import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE
const api = axios.create({
  baseURL: `${baseUrl}/auth`,
  withCredentials: true, //允許session ID 存入cookies
})

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const user = ref(null)

  const router = useRouter()

  const getIsAuthenticated = computed(() => isAuthenticated.value) //確保外部程式碼只能讀取不能修改他
  const getUser = computed(() => user.value)

  async function login(credentials) {
    try {
      const response = await api.post('/login.php', credentials)
      //登入成功
      isAuthenticated.value = true
      user.value = response.data.user

      ElMessage.success('登入成功')
      await router.push('/')
    } catch (error) {
      //console.error('登入失敗:', error.response?.data?.message || error.message)
      ElMessage.error(error.response?.data?.message || '登入失敗，請重試。')
    }
  }

  //檢查當前使用者登入狀態
  async function checkAuthStatus() {
    try {
      const response = await api.get('/check_session.php')

      if (response.data.isAuthenticated) {
        isAuthenticated.value = true
        user.value = response.data.user
      } else {
        isAuthenticated.value = false
        user.value = null
      }
    } catch (error) {
      //console.error('檢查登入狀態失敗:', error)
      isAuthenticated.value = false
      user.value = null
    }
  }

  // 登出使用者並清除狀態。
  async function logout() {
    try {
      const response = await api.get('/logout.php')

      if (response.data.success) {
        isAuthenticated.value = false
        user.value = null
        ElMessage.info('您已登出')
        await router.push('/login')
      } else {
        throw new Error('登出失敗')
      }
    } catch (error) {
      //console.error(error.message);
      ElMessage.error('登出失敗')
    }
  }

  return {
    isAuthenticated: getIsAuthenticated,
    user: getUser,
    login,
    logout,
    checkAuthStatus,
  }
})
