// stores/new_store.js

import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

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
  //     //console.error('Fetch 錯誤：', err)
  //   }
  // }

  //以下是真正從API載入資料
  const fetchnewData = async (forceRefresh = false) => {
    if (!forceRefresh && newData.value.length > 0 && categories.value.length > 0) {
      return
    }

    fetchError.value = null
    try {
      const baseUrl = import.meta.env.VITE_API_BASE
      const apiUrl = `${baseUrl}/news/get_news.php`
      const response = await axios.get(apiUrl)

      // 在存入 state 前，處理圖片路徑
      const processedNews = response.data.news.map((item) => {
        // 檢查 image_url 是否存在，並且是一個相對路徑 (以 '/' 開頭)
        if (item.image_url && item.image_url.startsWith('/')) {
          return {
            ...item,
            image_url: baseUrl + item.image_url, // 拼接成完整 URL
          }
        }
        // 如果 image_url 不符合條件 (例如 null 或已經是完整的 http 路徑)，直接返回
        return item
      })

      newData.value = processedNews
      categories.value = response.data.categories
    } catch (err) {
      fetchError.value = '資料載入失敗，請稍後再試'
      //console.error('Fetch 錯誤：', err)
      throw new Error(fetchError.value)
    }
  }

  //  新增資料start====================================================================

  //新增資料-舊的無api模擬版------------start
  // const addNews = (newsItem) => {
  //   // 1. 找到對應的分類物件
  //   //    從 categories 陣列中，找到 id 和傳入的 newsItem.category_id 匹配的那個分類
  //   const category = categories.value.find((cat) => cat.category_id === newsItem.category_id)

  //   // 2. 計算新的 ID
  //   //    (這裡有一個小 bug，您在計算 newId 時還在使用 i.id，應該是 i.news_id)
  //   const newId =
  //     newData.value.length > 0 ? Math.max(...newData.value.map((i) => i.news_id)) + 1 : 1

  //   // 3. 組合出一個「結構完整」的新項目
  //   const item = {
  //     ...newsItem,
  //     news_id: newId,
  //     // ***【核心修改】***
  //     // 如果找到了分類，就把它的名稱加進去；如果沒找到，就給個空字串
  //     category_name: category ? category.category_name : '',
  //   }

  //   // 4. 將完整的新項目加到陣列最前面
  //   newData.value = [item, ...newData.value]
  // }

  //新增資料-舊的無api模擬版------------end

  // 新增資料連接真實後端 API 的版本###############################################
  // 參數現在會接收一個 FormData 物件
  const addNews = async (formData) => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE
      const apiUrl = `${baseUrl}/news/post_new.php`
      const response = await axios.post(apiUrl, formData)

      if (response.data && response.data.success) {
        ElMessage.success(response.data.message || '新增成功！')
        // *** 關鍵修改：呼叫 fetchnewData 並傳入 true，強制它獲取最新資料 ***
        await fetchnewData(true)
      } else {
        throw new Error(response.data.message || '後端處理失敗')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || '新增操作失敗'
      ElMessage.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  //  新增資料end====================================================================

  //  編輯資料start====================================================================

  //  編輯資料-舊的無api模擬版 用本身假資料------------start
  // const updateNews = (id, updatedData) => {
  //   const targetId = Number(id)
  //   const index = newData.value.findIndex((i) => i.news_id === targetId)
  //   if (index !== -1) {
  //     // 這種寫法可以確保響應性
  //     newData.value[index] = { ...newData.value[index], ...updatedData }
  //   }
  // }

  //  編輯資料-舊的無api模擬版------------end

  // 編輯資料連接真實後端 API 的版本###############################################

  const updateNews = async (formData) => {
    const newsId = Number(formData.get('news_id'))

    try {
      const baseUrl = import.meta.env.VITE_API_BASE
      const apiUrl = `${baseUrl}/news/path_new.php`

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data && response.data.success) {
        ElMessage.success(response.data.message || '更新成功！')

        const index = newData.value.findIndex((item) => item.news_id === newsId)
        if (index !== -1) {
          const updatedItemData = response.data.updated_data
          const oldItem = newData.value[index]

          // 處理分類名稱 (這部分邏輯不變)
          let newCategoryName = oldItem.category_name
          if (updatedItemData.category_id !== undefined) {
            const newCategory = categories.value.find(
              (cat) => cat.category_id === updatedItemData.category_id
            )
            newCategoryName = newCategory ? newCategory.category_name : '未知分類'
          }

          // 【新增的邏輯】處理圖片 URL
          // 預設圖片路徑是舊的 URL
          let finalImageUrl = oldItem.image_url
          // 檢查後端是否回傳了新的 image_url
          if (updatedItemData.image_url) {
            // 如果回傳的是相對路徑，就拼接成完整 URL
            if (updatedItemData.image_url.startsWith('/')) {
              finalImageUrl = baseUrl + updatedItemData.image_url
            } else {
              // 如果回傳的不是相對路徑 (可能是舊資料的完整路徑)，就直接使用
              finalImageUrl = updatedItemData.image_url
            }
          }

          // 組合最終的更新物件
          const finalUpdatedItem = {
            ...oldItem,
            ...updatedItemData,
            category_name: newCategoryName,
            image_url: finalImageUrl, // <-- 使用我們剛剛處理好的、完整的圖片 URL
          }

          // 用最終組合好的、資料完整的物件，替換掉 state 陣列中的舊項目
          newData.value[index] = finalUpdatedItem
        }
      } else {
        throw new Error(response.data.message || '後端更新失敗')
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || '更新操作時發生未知錯誤'
      ElMessage.error(errorMessage)
      throw error
    }
  }
  //  編輯資料end====================================================================

  //  刪除資料start====================================================================

  //  刪除資料-舊的無api模擬版------------start
  // const deleteNews = (id) => {
  //   newData.value = newData.value.filter((item) => item.news_id !== id)
  // }
  //  刪除資料-舊的無api模擬版------------end

  //刪除資料連接真實後端 API 的版本###############################################

  const deleteNews = async (id) => {
    try {
      // 1. 組合 API 的 URL
      const baseUrl = import.meta.env.VITE_API_BASE
      const apiUrl = `${baseUrl}/news/delete_new.php`

      // 2. 使用 axios 發送 DELETE 請求
      //    對於 DELETE 請求，若要傳遞 body，需要放在 config 物件的 `data` 屬性中
      const response = await axios.delete(apiUrl, {
        data: { news_id: id },
      })

      // 3. 處理後端回應
      if (response.data && response.data.success) {
        // 3a. 如果後端成功刪除，顯示成功訊息
        ElMessage.success(response.data.message || '刪除成功！')

        // 3b. 從前端的 state (newData.value) 中移除這筆資料，UI 會即時更新
        //     這是最高效的方式，避免了重新向後端請求整個列表
        const targetId = Number(id)
        newData.value = newData.value.filter((item) => item.news_id !== targetId)
      } else {
        // 如果後端回應 success: false，主動拋出錯誤
        throw new Error(response.data.message || '後端處理失敗')
      }
    } catch (error) {
      // 4. 捕捉所有錯誤 (網路錯誤、後端錯誤等)
      //    從 error 物件中提取最精確的錯誤訊息
      const errorMessage =
        error.response?.data?.message || error.message || '刪除操作時發生未知錯誤'
      ElMessage.error(errorMessage)

      // 再次拋出錯誤，讓呼叫此函式的 Vue 元件也能知道操作失敗了
      throw error
    }
  }

  //  刪除資料end====================================================================

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
