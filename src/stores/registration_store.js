// stores/registration_store.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRegistrationStore = defineStore('registration', () => {
    const registrationList = ref([])
    const fetchError = ref(null)

    // 抓某活動的報名名單
    const fetchRegistrationByEvent = async (eventId) => {
        fetchError.value = null
        try {
            // 將 event_id 改為 activity_id
            const res = await axios.get(`http://localhost:8888/guard-sea_api/events/get_registrations.php?activity_id=${eventId}`)
            if (res.data.status === 'success') {
                registrationList.value = res.data.data
            } else {
                fetchError.value = res.data.message || '載入報名名單失敗'
            }
        } catch (err) {
            console.error('報名名單載入失敗', err)
            fetchError.value = '無法連線到伺服器'
        }
    }

    // 抓某會員的報名紀錄（會員中心用）
    const fetchRegistrationByUser = async (userId) => {
        fetchError.value = null
        try {
            // 這邊的 user_id 在你的後端也需要確保名稱一致
            const res = await axios.get(`http://localhost:8888/guard-sea_api/registrations/get_registrations.php?user_id=${userId}`)
            if (res.data.status === 'success') {
                registrationList.value = res.data.data
            } else {
                fetchError.value = res.data.message || '載入會員報名紀錄失敗'
            }
        } catch (err) {
            console.error('會員報名紀錄載入失敗', err)
            fetchError.value = '無法連線到伺服器'
        }
    }

    // 新增報名（前台表單送出用）
    const addRegistration = async (registration) => {
        try {
            const res = await axios.post('http://localhost:8888/guard-sea_api/registrations/add_registration.php', registration)
            if (res.data.status === 'success') {
                console.log('報名成功', res.data)
                return { success: true, message: res.data.message }
            } else {
                return { success: false, message: res.data.message }
            }
        } catch (err) {
            console.error('報名失敗', err)
            return { success: false, message: '無法連線到伺服器' }
        }
    }

    return { registrationList, fetchError, fetchRegistrationByEvent, fetchRegistrationByUser, addRegistration }
})