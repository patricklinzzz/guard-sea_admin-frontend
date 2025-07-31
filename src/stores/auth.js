import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

/**
 * 身份驗證 Store
 *
 * 集中管理使用者的身份驗證狀態，包含 token 和使用者資訊。
 * 它處理登入、登出邏輯，並將狀態持久化到 localStorage。
 */
export const useAuthStore = defineStore('auth', () => {
  // --- State ---
  // 從 localStorage 初始化 token 和 user，以在重新整理瀏覽器後保持登入狀態。
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  // --- Getters ---
  // 一個 computed 屬性，方便在任何地方檢查使用者是否已登入。
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const router = useRouter()

  // --- Actions ---

  /**
   * 處理使用者登入流程。
   * @param {object} credentials - 使用者的登入憑證。
   * @param {string} credentials.username - 使用者帳號 (電子信箱)。
   * @param {string} credentials.password - 使用者密碼。
   */
  async function login(credentials) {
    try {
      // --- 模擬 API 請求 ---
      console.log('正在使用憑證登入:', credentials)
      await new Promise((resolve) => setTimeout(resolve, 1000)) // 模擬網路延遲

      // 建立一組假的帳號密碼用於測試
      const FAKE_USER = 'admin@example.com'
      const FAKE_PASSWORD = 'password123!'

      // 驗證帳號密碼
      if (credentials.username !== FAKE_USER || credentials.password !== FAKE_PASSWORD) {
        // 如果不匹配，拋出錯誤，會被下方的 catch 區塊捕獲
        throw new Error('Invalid credentials')
      }

      // 登入成功，回傳假資料
      const fakeApiResponse = {
        token: `fake-jwt-token-for-${credentials.username}`,
        user: { name: 'Admin User', email: credentials.username },
      }
      // --- API 請求模擬結束 ---

      token.value = fakeApiResponse.token
      user.value = fakeApiResponse.user
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))

      ElMessage.success('登入成功')
      await router.push('/')
    } catch (error) {
      console.error('登入失敗:', error.message)
      ElMessage.error('帳號或密碼錯誤，請重試。')
    }
  }

  /**
   * 登出使用者並清除狀態。
   */
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    ElMessage.info('您已登出')
    router.push('/login') // 假設您的登入頁路由為 /login
  }

  // 匯出 state, getters, 和 actions。
  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
  }
})
