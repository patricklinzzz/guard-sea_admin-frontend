import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref([])

  const fetchAdmins = async () => {
    try {
      const res = await axios.get('https://tibamef2e.com/cjd101/g1/api/admins/get_admins.php')
      admins.value = res.data
      console.log('Admin data fetched successfully:', admins.value)
    } catch (error) {
      console.log(error)
    }
  }

  const addAdmin = (adminData) => {
    admins.value.unshift(adminData)
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
      const formData = new FormData()
      formData.append('administrator_id', adminId) 
      formData.append('status', newStatus)

      const response = await axios.post(
        'https://tibamef2e.com/cjd101/g1/api/admins/update_admin_status.php', 
        formData
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
