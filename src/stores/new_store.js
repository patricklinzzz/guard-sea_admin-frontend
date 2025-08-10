// stores/new_store.js

import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewStore = defineStore('new', () => {
  const newData = ref([])
  const categories = ref([]) //用來儲存分類列表
  const fetchError = ref(null)

  // 模擬從 API 讀取載入資料
  // const fetchnewData = async () => {
  //   // 保護機制保持不變
  //   if (newData.value.length > 0 && categories.value.length > 0) {
  //     return
  //   }

  //   fetchError.value = null
  //   try {
  //     // ***【修改點 1】***
  //     // 1. 模擬分類列表 (真實 API 會返回的 categories 部分)
  //     const mockCategories = [
  //       { category_id: 1, category_name: '品牌動態' },
  //       { category_id: 2, category_name: '優惠情報' },
  //       { category_id: 3, category_name: '活動花絮' },
  //     ]

  //     // ***【修改點 2】***
  //     // 2. 模擬新聞列表 (真實 API 經過 JOIN 後的樣子)
  //     //    - category_id 應該是數字
  //     //    - 應該包含 category_name 欄位
  //     const mockNews = [
  //       {
  //         news_id: 1,
  //         category_id: 1,
  //         category_name: '品牌動態', // <--- 加上這個欄位
  //         image_url: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '徵才公告：我們正在尋找充滿熱情的潛水教練和網站前端工程師，快來加入我們吧！',
  //         publish_date: '2025-07-09',
  //         status: 1,
  //       },
  //       {
  //         news_id: 2,
  //         category_id: 2,
  //         category_name: '優惠情報', // <--- 加上這個欄位
  //         image_url: 'https://images.pexels.com/photos/889929/pexels-photo-889929.jpeg',
  //         title: '夏季限定！兩人同行，一人免費潛水體驗課程。',
  //         publish_date: '2025-07-08',
  //         status: 0,
  //       },
  //       {
  //         news_id: 3,
  //         category_id: 3,
  //         category_name: '活動花絮', // <--- 加上這個欄位
  //         image_url: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '感謝大家參與上週末的淨灘活動，海洋因你而更美麗。',
  //         publish_date: '2025-06-02',
  //         status: 1,
  //       },
  //       // ... 其他資料也照此格式修改 ...
  //       {
  //         news_id: 4,
  //         category_id: 1,
  //         category_name: '品牌動態',
  //         image_url: 'https://images.pexels.com/photos/3854025/pexels-photo-3854025.jpeg',
  //         title: '全新系列蛙鞋與面鏡震撼上市，帶來前所未有的水下視野。',
  //         publish_date: '2025-07-07',
  //         status: 0,
  //       },
  //       {
  //         news_id: 5,
  //         category_id: 2,
  //         category_name: '優惠情報',
  //         image_url: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: 'VIP 會員專屬，全館裝備享 85 折特惠。',
  //         publish_date: '2025-07-07',
  //         status: 1,
  //       },
  //       {
  //         news_id: 6,
  //         category_id: 3,
  //         category_name: '活動花絮',
  //         image_url: 'https://images.pexels.com/photos/3854025/pexels-photo-3854025.jpeg',
  //         title: '我們的團隊成為了海洋保育署的年度環保志工夥伴。',
  //         publish_date: '2025-07-07',
  //         status: 1,
  //       },
  //       {
  //         news_id: 7,
  //         category_id: 2,
  //         category_name: '優惠情報',
  //         image_url: 'https://images.pexels.com/photos/1112007/pexels-photo-1112007.jpeg',
  //         title: '結帳輸入「DIVE2025」即可獲得 200 元折扣碼。',
  //         publish_date: '2025-07-07',
  //         status: 1,
  //       },
  //     ]

  //     // ***【修改點 3】***
  //     // 3. 將模擬資料分別賦值給對應的 state
  //     newData.value = mockNews
  //     categories.value = mockCategories
  //   } catch (err) {
  //     fetchError.value = '資料載入失敗，請稍後再試'
  //     console.error('Fetch 錯誤：', err)
  //   }
  // }

  //以下是真正從API載入資料

  const fetchnewData = async () => {
    // 如果兩份資料都已經有了，就直接返回
    if (newData.value.length > 0 && categories.value.length > 0) {
      return
    }

    fetchError.value = null
    try {
      const apiUrl = 'http://localhost:8888/guardsea-api/get_news.php'
      const response = await axios.get(apiUrl)

      // 從返回的物件中，分別取出 news 和 categories
      newData.value = response.data.news
      categories.value = response.data.categories
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      console.error('Fetch 錯誤：', err)
    }
  }

  //  新增資料
  const addNews = (newsItem) => {
    // 1. 找到對應的分類物件
    //    從 categories 陣列中，找到 id 和傳入的 newsItem.category_id 匹配的那個分類
    const category = categories.value.find((cat) => cat.category_id === newsItem.category_id)

    // 2. 計算新的 ID
    //    (這裡有一個小 bug，您在計算 newId 時還在使用 i.id，應該是 i.news_id)
    const newId =
      newData.value.length > 0 ? Math.max(...newData.value.map((i) => i.news_id)) + 1 : 1

    // 3. 組合出一個「結構完整」的新項目
    const item = {
      ...newsItem,
      news_id: newId,
      // ***【核心修改】***
      // 如果找到了分類，就把它的名稱加進去；如果沒找到，就給個空字串
      category_name: category ? category.category_name : '',
    }

    // 4. 將完整的新項目加到陣列最前面
    newData.value = [item, ...newData.value]
  }

  //  編輯資料
  const updateNews = (id, updatedData) => {
    const targetId = Number(id)
    const index = newData.value.findIndex((i) => i.news_id === targetId)
    if (index !== -1) {
      // 這種寫法可以確保響應性
      newData.value[index] = { ...newData.value[index], ...updatedData }
    }
  }

  //  刪除資料
  const deleteNews = (id) => {
    newData.value = newData.value.filter((item) => item.news_id !== id)
  }

  return {
    newData,
    fetchError,
    fetchnewData,
    addNews,
    updateNews,
    deleteNews,
    categories,
  }
})
