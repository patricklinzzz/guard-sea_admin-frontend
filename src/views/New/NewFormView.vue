<template>
  <div class="content-block-wrapper">
    <header class="content-header">
      <h2 class="content_title">{{ pageTitle }}</h2>
    </header>

    <div v-if="!isReady && !loadError" class="loading-state">載入中...</div>
    <div v-if="loadError" class="error-state">找不到該筆資料，請返回列表頁。</div>

    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="max-width: 800px"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="標題" prop="title">
        <el-input v-model="form.title" placeholder="請輸入消息標題" />
      </el-form-item>

      <el-form-item label="分類" prop="category_id">
        <el-select v-model="form.category_id" placeholder="請選擇分類" style="width: 100%">
          <el-option
            v-for="category in newStore.categories"
            :key="category.category_id"
            :label="category.category_name"
            :value="category.category_id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="日期" prop="publish_date">
        <el-date-picker
          v-model="form.publish_date"
          type="date"
          placeholder="選擇日期"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="顯示狀態" prop="status">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          active-text="顯示"
          inactive-text="不顯示"
        />
      </el-form-item>

      <el-form-item label="封面圖片" prop="cover_image">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleCoverImageChange"
          accept="image/*"
        >
          <el-button type="primary">選擇圖片</el-button>
        </el-upload>
        <div v-if="imagePreviewUrl" class="coverimage-preview">
          <img :src="imagePreviewUrl" alt="封面預覽" class="coverimage-img" />
        </div>
        <div v-else class="image-placeholder">請上傳一張圖片</div>
      </el-form-item>

      <el-form-item label="消息內容" prop="content" class="editor-wrap">
        <CKEditorComponent v-if="isReady" v-model="form.content" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          {{ isEditMode ? '儲存更新' : '確認新增' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import CKEditorComponent from '@/components/ckeditor.vue'
  import { useNewStore } from '@/stores/new_store'

  // --- 核心變數 ---
  const route = useRoute()
  const router = useRouter()
  const newStore = useNewStore()
  const formRef = ref(null)

  // --- 狀態管理 ---
  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯消息內容' : '新增消息內容'))
  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)

  // --- 表單資料模型 ---
  const form = reactive({
    title: '',
    category_id: '',
    publish_date: '',
    content: '',
    status: 1,
  })

  const coverImageFile = ref(null)
  const imagePreviewUrl = ref('')

  // --- 表單驗證規則 ---
  const rules = reactive({
    title: [{ required: true, message: '請輸入消息標題', trigger: 'blur' }],
    category_id: [{ required: true, message: '請選擇一個分類', trigger: 'change' }],
    publish_date: [{ required: true, message: '請選擇發布日期', trigger: 'change' }],
    content: [{ required: true, message: '請輸入消息內容', trigger: 'blur' }],
    cover_image: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (!coverImageFile.value && !isEditMode.value) {
            callback(new Error('請上傳一張封面圖片'))
          } else {
            callback()
          }
        },
        trigger: 'change',
      },
    ],
  })

  // --- 生命週期鉤子 ---
  onMounted(async () => {
    try {
      if (newStore.categories.length === 0) {
        await newStore.fetchnewData()
      }
      if (isEditMode.value) {
        const id = Number(route.params.id)
        const item = newStore.newData.find((i) => i.news_id === id)
        if (item) {
          Object.assign(form, item)
          imagePreviewUrl.value = item.image_url
        } else {
          loadError.value = true
          ElMessage.error('找不到要編輯的資料。')
        }
      } else {
        form.publish_date = new Date().toISOString().split('T')[0]
      }
    } catch (err) {
      loadError.value = true
      console.error('頁面載入失敗:', err)
    } finally {
      isReady.value = true
    }
  })

  // --- 方法 ---
  const handleCoverImageChange = (uploadFile) => {
    const file = uploadFile.raw
    if (file) {
      coverImageFile.value = file
      imagePreviewUrl.value = URL.createObjectURL(file)
      formRef.value.validateField('cover_image')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  // #############################################################################
  // ###                                                                       ###
  // ###         【最終修正版的 handleSubmit 函式】 - 開始                       ###
  // ###                                                                       ###
  // #############################################################################
  const handleSubmit = async () => {
    if (!formRef.value) return
    if (isSubmitting.value) return

    // 步驟 1：觸發 Element Plus 的全表單驗證
    // validate() 會回傳一個 Promise，可以直接 await
    try {
      await formRef.value.validate()
    } catch (error) {
      // 如果驗證失敗，validate() 會 reject 一個 Promise，被 catch 捕捉
      ElMessage.error('請檢查表單中的必填欄位。')
      return // 中斷函式執行
    }

    // 如果程式能執行到這裡，代表驗證已通過
    isSubmitting.value = true

    // 步驟 2：打包 FormData
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('category_id', form.category_id)
    formData.append('publish_date', form.publish_date)
    formData.append('content', form.content)
    formData.append('status', form.status)

    formData.append('api_base_path', import.meta.env.VITE_API_BASE)

    // 步驟 3：根據模式（新增/編輯）執行對應的操作
    try {
      if (isEditMode.value) {
        // --- 編輯模式 ---
        formData.append('news_id', Number(route.params.id))
        if (coverImageFile.value) {
          formData.append('cover_image', coverImageFile.value)
        }
        await newStore.updateNews(formData) // <-- 編輯功能的呼叫
      } else {
        // --- 新增模式 ---
        formData.append('cover_image', coverImageFile.value)
        // 步驟 4：呼叫 Pinia Store 的 action
        await newStore.addNews(formData)
      }

      // 步驟 5：處理成功結果
      // 如果上面的 await 沒有拋出錯誤，就代表 API 呼叫成功
      // ElMessage.success 已經在 Store 中呼叫了，這裡只需要處理跳轉
      router.push({ name: 'newlist' })
    } catch (error) {
      // 步驟 6：處理失敗結果
      // 如果 Store 中的 action 拋出了錯誤，會在這裡被捕捉到
      // ElMessage.error 也已經在 Store 中處理了
      // 這裡主要是為了確保 loading 狀態能被關閉
      console.error('表單提交時發生錯誤:', error)
    } finally {
      // 步驟 7：無論成功或失敗，最後都要關閉按鈕的 loading 狀態
      isSubmitting.value = false
    }
  }
  // #############################################################################
  // ###                                                                       ###
  // ###         【最終修正版的 handleSubmit 函式】 - 結束                       ###
  // ###                                                                       ###
  // #############################################################################
</script>

<style lang="scss" scoped>
  /* 唯一的修改在這裡：移除了 max-width 和 margin: auto */
  .content-block-wrapper {
    padding: 2rem;
    /* 移除了 max-width: 900px; */
    /* 移除了 margin: auto; */
  }

  /* 標題靠左，並調整一下間距 */
  .content_title {
    margin-bottom: 2rem;
    /* 移除了 text-align: center; */
    font-size: 1.8rem;
  }

  /* 其他樣式保持不變 */
  .coverimage-preview {
    margin-top: 1rem;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    padding: 8px;
    width: 250px;
    height: auto;
  }
  .coverimage-img {
    max-width: 100%;
    border-radius: 4px;
    display: block;
  }
  .image-placeholder {
    margin-top: 1rem;
    color: #a8abb2;
    font-size: 14px;
  }
  .editor-wrap {
    min-height: 400px;
    :deep(.ck-editor__editable_inline) {
      min-height: 350px;
      padding: 1rem;
    }
  }
  .loading-state,
  .error-state {
    text-align: center;
    padding: 4rem;
    font-size: 1.2rem;
    color: #606266;
  }
</style>
