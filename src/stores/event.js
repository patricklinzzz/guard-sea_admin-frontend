import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEventStore = defineStore('event', () => {
    // State
    const allTableData = ref([])

    // Actions
    const fetchTableData = async () => {
        // 這裡可以換成實際的 API 呼叫，例如:
        // const response = await axios.get('/api/events')
        // allTableData.value = response.data
        
        const fakeData = [
        {   
            id: 1, 
            title: '淨灘活動：用雙手還給海洋純淨', 
            category: '實體行動', 
            deadline: '2025.11.23', 
            date: '2025.11.28(六) 09:00 - 12:00', 
            quota: 100, 
            status: 'registering' 
        },
        {   
            id: 2, 
            title: '教育講座：深度認識海洋', 
            category: '教育推廣', 
            deadline: '2025.11.15', 
            date: '2025.11.20(四) 10:00 - 13:00', 
            quota: 200, 
            status: 'registering' },
        { 
            id: 3, 
            title: '海底漫遊live：水下攝影即時導覽', 
            category: '線上參與', 
            deadline: '2025.01.08', 
            date: '2025.11.13(四) 20:00 - 21:00', 
            quota: 150, 
            status: 'registering' 
        },
        { 
            id: 4, 
            title: '海上瑜珈&日出冥想', 
            category: '實體行動', 
            deadline: '2025.11.03', 
            date: '2025.11.08(六) 05:30 - 07:00', 
            quota: 30, 
            status: 'registering' 
        },
        { 
            id: 5, 
            title: '深海奇遇：3D', 
            category: '教育推廣', 
            deadline: '2025.10.25', 
            date: '2025.11.01(六) 14:00 - 16:00', 
            quota: 100, 
            status: 'registering' 
        },
        { 
            id: 6, 
            title: '夜間潮間帶探索活動', 
            category: '實體行動', 
            deadline: '2025.10.25', 
            date: '2025.10.30(四) 19:00 - 21:00', 
            quota: 20, 
            status: 'registering' 
        },
        { 
            id: 7, 
            title: '餐桌上的海洋：永續漁業探索', 
            category: '教育推廣', 
            deadline: '2025.10.16', 
            date: '2025.10.21(二) 14:00 - 16:00', 
            quota: 80, 
            status: 'registering' 
        },
        { 
            id: 8, 
            title: '海的聲音：鯨豚聲音導聽工作坊', 
            category: '線上參與', 
            deadline: '2025.10.12', 
            date: '2025.10.17(五) 19:30 - 21:00', 
            quota: 150, 
            status: 'registering' 
        },
        { 
            id: 9, 
            title: '微塑膠在哪裡？沙灘採樣與顯微觀察體驗', 
            category: '實體行動', 
            deadline: '2025.10.06', 
            date: '2025.10.11(六) 10:00 - 14:00', 
            quota: 25, 
            status: 'registering' 
        },
        { 
            id: 10, 
            title: '打造你的海洋行動提案', 
            category: '實體行動', 
            deadline: '2025.09.25', 
            date: '2025.10.01(三) 13:00 - 17:00', 
            quota: 40, 
            status: 'registering' 
        },
        { 
            id: 11, 
            title: '環保漁港導覽與清港行動', 
            category: '實體行動', 
            deadline: '2025.09.16', 
            date: '2025.09.21(日) 09:00 - 16:00', 
            quota: 50, 
            status: 'registering' 
        },
        { 
            id: 12, 
            title: '海洋藝術創作工作坊', 
            category: '教育推廣', 
            deadline: '2025.08.26', 
            date: '2025.09.01(一) 13:00 - 17:00', 
            quota: 30, 
            status: 'registering' 
        },
        { 
            id: 13, 
            title: '無塑海灘：社區淨灘與廢棄物記錄工作坊', 
            category: '實體行動', 
            deadline: '2025.0808', 
            date: '2025.08.13(日) 09:00 - 13:00', 
            quota: 60, 
            status: 'registering' 
        },
        { 
            id: 14, 
            title: '線上海洋講座：解謎深海', 
            category: '線上參與', 
            deadline: '2025.07.25', 
            date: '2025.07.30(一) 20:00 - 21:30', 
            quota: 150, 
            status: 'registering' 
        },
        { 
            id: 15, 
            title: '海洋知識線上問答賽', 
            category: '線上參與', 
            deadline: '2025.07.21', 
            date: '2025.07.26(日) 14:00 - 15:00', 
            quota: 20, 
            status: 'registering' 
        },
        { 
            id: 16, 
            title: '珊瑚復育志工體驗營', 
            category: '實體行動', 
            deadline: '2025.07.07', 
            date: '2025.07.12(六) 08:30 - 17:00', 
            quota: 5, 
            status: 'registering' 
        },
        ]
        allTableData.value = fakeData
    }

    const updateEventStatus = (id, newStatus) => {
        const target = allTableData.value.find(item => item.id === id)
        if (target) {
        target.status = newStatus
        // 這裡可以呼叫 API 來更新後端資料
        // await axios.patch(`/api/events/${id}`, { status: newStatus })
        }
    }

    // Getters
    const categoryOptions = computed(() => {
        const counts = {}
        allTableData.value.forEach(item => {
        if (item.category) {
            counts[item.category] = (counts[item.category] || 0) + 1
        }
        })
        return Object.entries(counts).map(([key, count]) => ({
        label: key,
        value: key,
        count,
        }))
    })

    return {
        allTableData,
        fetchTableData,
        updateEventStatus,
        categoryOptions,
    }
})