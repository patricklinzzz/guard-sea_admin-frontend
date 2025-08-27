// event_store.js
import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEventStore = defineStore('event', () => {
  const eventData = ref([])
  const categoryData = ref([])
  const fetchError = ref(null)

  const API_BASE_URL = import.meta.env.VITE_API_BASE

  const fetchEventData = async () => {
    fetchError.value = null
    try {
      const res = await axios.get(`${API_BASE_URL}/events/get_event.php`)

      if (res.data.status === 'success') {
        const { events, categories } = res.data.data // 從 data 物件中解構 events 和 categories

        // 處理活動資料
        eventData.value = events.map((item) => ({
          id: item.activity_id,
          title: item.title,
          category: item.category_id,
          registration_close_date: item.registration_close_date,
          start_date: item.start_date,
          end_date: item.end_date,
          location: item.location,
          preface: item.preface,
          description: item.description,
          notes: item.notes,
          image_url: item.image_url,
          quota: Number(item.quota),
          status: item.status,
          presenter: item.presenter,
          deadline: item.registration_close_date,
          eventDate: [item.start_date, item.end_date],
        }))

        // 儲存分類資料
        categoryData.value = categories.map((item) => ({
          id: item.category_id,
          name: item.category_name,
        }))
      } else {
        fetchError.value = res.data.message || '載入活動失敗'
      }
    } catch (err) {
      //console.error('活動資料載入失敗', err)
      fetchError.value = '無法連線到伺服器'
    }
  }

  const addEvent = async (event) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/events/add_event.php`, event)
      if (res.data.status === 'success') {
        //console.log('活動新增成功', res.data)
        await fetchEventData()
        return { success: true, message: res.data.message }
      } else {
        //console.error('新增活動失敗', res.data.message)
        return { success: false, message: res.data.message }
      }
    } catch (err) {
      //console.error('新增活動時發生錯誤', err)
      return { success: false, message: '無法連線到伺服器或發生網路錯誤' }
    }
  }

  return { eventData, categoryData, fetchError, fetchEventData, addEvent }
})

//             {
//                 id: 1,
//                 title: '淨灘活動：用雙手還給海洋純淨',
//                 category: '實體行動',
//                 deadline: '2025.11.23',
//                 eventDate: ['2025-11-28 09:00', '2025-11-28 12:00'],
//                 quota: 100,
//                 status: '報名中'
//             },
//             {
//                 id: 2,
//                 title: '教育講座：深度認識海洋',
//                 category: '推廣教育',
//                 deadline: '2025.11.15',
//                 eventDate: ['2025-11-20 10:00', '2025-11-20 13:00'],
//                 quota: 200,
//                 status: '報名中'
//             },
//             {
//                 id: 3,
//                 title: '海底漫遊live：水下攝影即時導覽',
//                 category: '線上參與',
//                 deadline: '2025.01.08',
//                 eventDate: ['2025-11-13 20:00', '2025-11-13 21:00'],
//                 quota: 150,
//                 status: '報名中'
//             },
//             {
//                 id: 4,
//                 title: '海上瑜珈&日出冥想',
//                 category: '實體行動',
//                 deadline: '2025.11.03',
//                 eventDate: ['2025-11-08 05:30', '2025-11-08 07:00'],
//                 quota: 30,
//                 status: '報名中'
//             },
//             {
//                 id: 5,
//                 title: '深海奇遇：3D',
//                 category: '推廣教育',
//                 deadline: '2025.10.25',
//                 eventDate: ['2025-11-01 14:00', '2025-11-01 16:00'],
//                 quota: 100,
//                 status: '報名中'
//             },
//             {
//                 id: 6,
//                 title: '夜間潮間帶探索活動',
//                 category: '實體行動',
//                 deadline: '2025.10.25',
//                 eventDate: ['2025-10-30 19:00', '2025-10-30 21:00'],
//                 quota: 20,
//                 status: '報名中'
//             },
//             {
//                 id: 7,
//                 title: '餐桌上的海洋：永續漁業探索',
//                 category: '推廣教育',
//                 deadline: '2025.10.16',
//                 eventDate: ['2025-10-21 14:00', '2025-10-21 16:00'],
//                 quota: 80,
//                 status: '報名中'
//             },
//             {
//                 id: 8,
//                 title: '海的聲音：鯨豚聲音導聽工作坊',
//                 category: '線上參與',
//                 deadline: '2025.10.12',
//                 eventDate: ['2025-10-17 19:30', '2025-10-17 21:00'],
//                 quota: 150,
//                 status: '報名中'
//             },
//             {
//                 id: 9,
//                 title: '微塑膠在哪裡？沙灘採樣與顯微觀察體驗',
//                 category: '實體行動',
//                 deadline: '2025.10.06',
//                 eventDate: ['2025-10-11 10:00', '2025-10-11 14:00'],
//                 quota: 25,
//                 status: '報名中'
//             },
//             {
//                 id: 10,
//                 title: '打造你的海洋行動提案',
//                 category: '實體行動',
//                 deadline: '2025.09.25',
//                 eventDate: ['2025-10-01 13:00', '2025-10-01 17:00'],
//                 quota: 40,
//                 status: '報名中'
//             },
//             {
//                 id: 11,
//                 title: '環保漁港導覽與清港行動',
//                 category: '實體行動',
//                 deadline: '2025.09.16',
//                 eventDate: ['2025-09-21 09:00', '2025-09-21 16:00'],
//                 quota: 50,
//                 status: '報名中'
//             },
//             {
//                 id: 12,
//                 title: '海洋藝術創作工作坊',
//                 category: '推廣教育',
//                 deadline: '2025.08.26',
//                 eventDate: ['2025-09-01 13:00', '2025-09-01 17:00'],
//                 quota: 30,
//                 status: '報名中'
//             },
//             {
//                 id: 13,
//                 title: '無塑海灘：社區淨灘與廢棄物記錄工作坊',
//                 category: '實體行動',
//                 deadline: '2025.08.08',
//                 eventDate: ['2025-08-13 09:00', '2025-08-13 13:00'],
//                 quota: 60,
//                 status: '報名中'
//             },
//             {
//                 id: 14,
//                 title: '線上海洋講座：解謎深海',
//                 category: '線上參與',
//                 deadline: '2025.07.25',
//                 eventDate: ['2025-07-30 20:00', '2025-07-30 21:30'],
//                 quota: 150,
//                 status: '報名中'
//             },
//             {
//                 id: 15,
//                 title: '海洋知識線上問答賽',
//                 category: '線上參與',
//                 deadline: '2025.07.21',
//                 eventDate: ['2025-07-26 14:00', '2025-07-26 15:00'],
//                 quota: 20,
//                 status: '報名中'
//             },
//             {
//                 id: 16,
//                 title: '珊瑚復育志工體驗營',
//                 category: '實體行動',
//                 deadline: '2025.07.07',
//                 eventDate: ['2025-07-12 08:30', '2025-07-12 17:00'],
//                 quota: 5,
//                 status: '報名中'
//             },
//         ]
//         eventData.value = eventApi
//         } catch (err) {
//         fetchError.value = '活動資料載入失敗，請稍後再試'
//         //console.error('Fetch 錯誤：', err)
//         }
//     }
