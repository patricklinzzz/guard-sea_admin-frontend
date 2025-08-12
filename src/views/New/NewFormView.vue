<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import CKEditorComponent from '@/components/ckeditor.vue'
  import { useNewStore } from '@/stores/new_store'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const newStore = useNewStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯消息內容' : '新增消息內容'))

  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)

  const form = reactive({
    title: '',
    category_id: '',
    publish_date: '',
    display: true, // 預設為顯示
    content: '',
    image_url: '',
  })

  onMounted(async () => {
    if (newStore.newData.length === 0) {
      await newStore.fetchnewData()
    }

    if (isEditMode.value) {
      const id = Number(route.params.id)
      const item = newStore.newData.find((i) => i.news_id === id)
      if (item) {
        // 使用 Object.assign 複製大部分欄位
        Object.assign(form, item)
        form.display = item.status === 1
      } else {
        loadError.value = true
      }
    }
    isReady.value = true
  })

  const handlecoverimageChange = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      form.image_url = reader.result
    }
    reader.readAsDataURL(file.raw)
  }

  const handleSubmit = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    // 準備要提交的資料，將布林值 display 轉換回數字 status
    const submissionData = {
      ...form,
      status: form.display ? 1 : 0, // true 轉為 1, false 轉為 0
    }
    // 刪除表單中暫時使用的 display 屬性，保持資料模型乾淨
    delete submissionData.display

    try {
      if (isEditMode.value) {
        const id = Number(route.params.id)
        // 將轉換後的正確資料傳給 updateNews
        newStore.updateNews(id, submissionData)
      } else {
        // 將轉換後的正確資料傳給 addNews
        newStore.addNews(submissionData) // await 不是必需的
      }

      router.push({ name: 'newlist' })
    } catch (err) {
      console.error('提交資料錯誤:', err)
      ElMessage({
        type: 'error',
        message: '提交失敗，請稍後再試。',
      })
    } finally {
      isSubmitting.value = false
    }
  }

  const handleCancel = () => {
    router.back()
  }
</script>
<template>
  <div class="content-block-wrapper">
    <header class="content-header">
      <h2 class="content_title">{{ pageTitle }}</h2>
    </header>
    <div v-if="!isReady">載入中...</div>
    <div v-else-if="loadError">找不到該筆資料，請返回列表頁。</div>
    <el-form v-else :model="form" label-width="100px" style="max-width: 800px">
      <el-form-item label="標題">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="分類">
        <el-select v-model="form.category_id" placeholder="請選擇分類">
          <!-- 使用 v-for 遍歷 store 中的分類列表 -->
          <el-option
            v-for="category in newStore.categories"
            :key="category.category_id"
            :label="category.category_name"
            :value="category.category_id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.publish_date"
          type="date"
          placeholder="選擇日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item label="顯示狀態">
        <el-switch v-model="form.display" active-text="顯示" inactive-text="不顯示" />
      </el-form-item>
      <el-form-item label="封面圖片">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :on-change="handlecoverimageChange"
          accept="image/*"
        >
          <el-button type="primary">選擇圖片</el-button>
        </el-upload>
        <div v-if="form.image_url" class="coverimage-preview">
          <img :src="form.image_url" alt="封面預覽" class="coverimage-img" />
        </div>
      </el-form-item>
      <el-form-item label="消息內容" class="editor-wrap">
        <CKEditorComponent v-if="isReady" v-model="form.content" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          {{ isEditMode ? '儲存' : '新增' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .content-block-wrapper {
    padding: 2rem;
  }
  .content_title {
    margin-bottom: 20px;
  }
  .coverimage-preview {
    margin-top: 1rem;
  }
  .coverimage-img {
    max-width: 200px;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
  .editor-wrap {
    min-height: 400px;
    :deep(.ck-editor__editable_inline) {
      min-height: 350px;
      padding: 1rem;
      border-radius: 6px;
      font-size: 16px;
      line-height: 1.6;
    }
  }

  .coverimage-preview {
    margin: 1.3rem;
  }
</style>
