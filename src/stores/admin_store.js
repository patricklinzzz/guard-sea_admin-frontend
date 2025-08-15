import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref([])
  //獲取管理員資料
  const fetchAdmins = async () => {
    try {
      const res = await axios.get('http://localhost:8888/api/admins/get_admins.php')
      admins.value = res.data
      console.log('Admin data fetched successfully:', admins.value)
    } catch (error) {
      console.log(error)
    }
  }
  //新增管理員
  const addAdmin = async (adminData) => {
    try {
      const response = await axios.post('http://localhost:8888/api/admins/add_admin.php',adminData)
      if (response.data.success) {
        console.log('管理員新增成功:', response.data.message)
        await fetchAdmins() 
      } else {
        throw new Error(response.data.error || response.data.message || '後端新增失敗')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getAdminById = (id) => {
    return admins.value.find((admin) => admin.id === id)
  }

  const updateAdmin = (updatedAdminData) => {
    const index = admins.value.findIndex((admin) => admin.id === updatedAdminData.id)
    if (index !== -1) {
      admins.value[index] = updatedAdminData
    }
  }

  //管理員狀態
  const updateAdminStatus = async (adminId, newStatus) => {
    try {
      const response = await axios.post(
        'http://localhost:8888/api/admins/update_admin_status.php',
        { id: adminId, status: newStatus }
      )
      if (response.data.success) {
        await fetchAdmins()
      } else {
        console.error(response.data.error)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return { admins, fetchAdmins, addAdmin, getAdminById, updateAdmin, updateAdminStatus }
})
