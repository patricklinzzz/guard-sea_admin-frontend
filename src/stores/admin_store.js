import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const admins = ref([
    {
      id: 'EMP001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '0912-345-678',
    },
    {
      id: 'EMP002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '0922-456-789',
    },
    {
      id: 'EMP003',
      name: 'Emily Davis',
      email: 'emily.davis@example.com',
      phone: '0933-567-890',
    },
    {
      id: 'EMP004',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '0944-678-901',
    },
    {
      id: 'EMP005',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      phone: '0955-789-012',
    },
    {
      id: 'EMP006',
      name: 'David Lee',
      email: 'david.lee@example.com',
      phone: '0966-890-123',
    },
  ])

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

  return { admins, addAdmin, getAdminById, updateAdmin }
})
