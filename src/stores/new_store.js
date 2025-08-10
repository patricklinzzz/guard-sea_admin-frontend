// stores/new_store.js

import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewStore = defineStore('new', () => {
  const newData = ref([])
  const fetchError = ref(null)

  // 模擬從 API 載入資料
  // const fetchnewData = async () => {
  //   // *** 這是最重要的保護機制 ***
  //   // 如果 newData 陣列中已經有資料，就直接返回，不再執行後續的 API 模擬。
  //   // 這可以保護已經在記憶體中被修改 (新增/編輯/刪除) 過的資料不被覆蓋。
  //   if (newData.value.length > 0) {
  //     return
  //   }

  //   fetchError.value = null
  //   try {
  //     // 這段程式碼現在只會在應用程式首次載入、資料為空時執行一次。
  //     const newDataApi = [
  //       {
  //         id: 1,
  //         category: '品牌動態',
  //         coverimage: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '徵才公告：我們正在尋找充滿熱情的潛水教練和網站前端工程師，快來加入我們吧！',
  //         date: '2025-07-09',
  //         status: 'published',
  //       },
  //       // ... 其他原始資料
  //       {
  //         id: 2,
  //         category: '優惠情報',
  //         coverimage: 'https://images.pexels.com/photos/889929/pexels-photo-889929.jpeg',
  //         title: '夏季限定！兩人同行，一人免費潛水體驗課程。',
  //         date: '2025-07-08',
  //         status: 'draft',
  //       },
  //       {
  //         id: 3,
  //         category: '活動花絮',
  //         coverimage: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '感謝大家參與上週末的淨灘活動，海洋因你而更美麗。',
  //         date: '2025-06-02',
  //         status: 'published',
  //       },
  //       {
  //         id: 4,
  //         category: '品牌動態',
  //         coverimage: 'https://images.pexels.com/photos/3854025/pexels-photo-3854025.jpeg',
  //         title: '全新系列蛙鞋與面鏡震撼上市，帶來前所未有的水下視野。',
  //         date: '2025-07-07',
  //         status: 'published',
  //       },
  //       {
  //         id: 5,
  //         category: '優惠情報',
  //         coverimage: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: 'VIP 會員專屬，全館裝備享 85 折特惠。',
  //         date: '2025-07-07',
  //         status: 'published',
  //       },
  //       {
  //         id: 6,
  //         category: '活動花絮',
  //         coverimage: 'https://images.pexels.com/photos/3854025/pexels-photo-3854025.jpeg',
  //         title: '我們的團隊成為了海洋保育署的年度環保志工夥伴。',
  //         date: '2025-07-07',
  //         status: 'published',
  //       },
  //       {
  //         id: 7,
  //         category: '優惠情報',
  //         coverimage: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '結帳輸入「DIVE2025」即可獲得 200 元折扣碼。',
  //         date: '2025-07-07',
  //         status: 'published',
  //       },
  //     ]
  //     newData.value = newDataApi
  //   } catch (err) {
  //     fetchError.value = '資料載入失敗，請稍後再試'
  //     console.error('Fetch 錯誤：', err)
  //   }
  // }
  
  //從API載入資料
  const fetchnewData = async()=>{
    if(newData.value.length>0){
      return
    }
    fetchError.value - null
    try{
      const apiUrl = 'http://localhost/api/get_news.php'
      const response = await axios.get(apiUrl)
      newData.value =response.data
    }catch(err){
      console.log(err);
    }
  }

  //  新增資料
  const addNews = (newsItem) => {
    // 注意：newsItem 應該是已經處理好 `status` 的物件
    const newId = newData.value.length > 0 ? Math.max(...newData.value.map((i) => i.id)) + 1 : 1
    const item = { ...newsItem, id: newId }
    newData.value = [...newData.value, item]
  }

  //  編輯資料
  const updateNews = (id, updatedData) => {
    const targetId = Number(id)
    const index = newData.value.findIndex((i) => i.id === targetId)
    if (index !== -1) {
      // 這種寫法可以確保響應性
      newData.value[index] = { ...newData.value[index], ...updatedData }
    }
  }

  //  刪除資料
  const deleteNews = (id) => {
    newData.value = newData.value.filter((item) => item.id !== id)
  }

  return {
    newData,
    fetchError,
    fetchnewData,
    addNews,
    updateNews,
    deleteNews,
  }
})
