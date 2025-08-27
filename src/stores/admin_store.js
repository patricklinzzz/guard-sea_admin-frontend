import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE

export const useAdminStore = defineStore('admin', () => {
  const admins = ref([])
  //獲取管理員資料
  const fetchAdmins = async () => {
    try {
      const apiUrl = `${baseUrl}/admins/get_admins.php`
      const response = await axios.get(apiUrl)
      admins.value = response.data
      //console.log('Admin data fetched successfully:', admins.value)
    } catch (error) {
      //console.log(error)
    }
  }
  //新增管理員
  const addAdmin = async (adminData) => {
    try {
      const apiUrl = `${baseUrl}/admins/add_admin.php`
      const response = await axios.post(apiUrl, adminData)
      if (response.data.success) {
        //console.log('管理員新增成功:', response.data.message)
        await fetchAdmins()
      } else {
        ElMessage.error(response.data.error || response.data.message || '新增失敗，請檢查資料。')
      }
    } catch (error) {
      //console.error(error)
    }
  }
  //編輯管理員取得id
  const getAdminById = (id) => {
    return admins.value.find((admin) => admin.administrator_id === id)
  }
  //編輯管理員
  const updateAdmin = async (updateAdminData) => {
    try {
      const apiUrl = `${baseUrl}/admins/update_admin.php`
      const response = await axios.patch(apiUrl, updateAdminData)
      if (response.data.success) {
        await fetchAdmins()
      } else {
        //console.error(response.data.error)
      }
    } catch (error) {
      //console.error(error)
    }
  }
  //管理員狀態
  const updateAdminStatus = async (adminId, newStatus) => {
    try {
      const apiUrl = `${baseUrl}/admins/update_admin_status.php`
      const response = await axios.patch(apiUrl, { id: adminId, status: newStatus })
      if (response.data.success) {
        await fetchAdmins()
      } else {
        ElMessage.error(response.data.error || '管理員狀態更新失敗。')
      }
    } catch (error) {
      ElMessage.error(
        error.response?.data?.error || error.response?.data?.message || '發生未知錯誤，請重試。'
      )
    }
  }

  return { admins, fetchAdmins, addAdmin, getAdminById, updateAdmin, updateAdminStatus }
})
