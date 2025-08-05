<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import CKEditorComponent from '@/components/ckeditor.vue'
  import { useNewStore } from '@/stores/new_store'
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
    category: '',
    date: '',
    display: true,
    content: '',
    coverimage: '',
  })

  onMounted(async () => {
    // 確保 store 中有資料，若無則先載入
    if (newStore.newData.length === 0) {
      await newStore.fetchnewData()
    }

    if (isEditMode.value) {
      const id = Number(route.params.id)
      const item = newStore.newData.find((i) => i.id === id)
      if (item) {
        Object.assign(form, item)
        // 將 status 轉換為 display 以便 switch 正確顯示
        form.display = item.status === 'published'
      } else {
        loadError.value = true
      }
    }
    isReady.value = true
  })

  const handlecoverimageChange = (file) => {
    const reader = new FileReader()
    reader.onload = () => {
      form.coverimage = reader.result
    }
    reader.readAsDataURL(file.raw)
  }

  const handleSubmit = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    // 準備要提交的資料，進行轉換
    const submissionData = {
      ...form,
      status: form.display ? 'published' : 'draft', // 將 display 轉換回 status
    }
    // 刪除不再需要的 display 屬性，保持資料模型乾淨
    delete submissionData.display

    try {
      if (isEditMode.value) {
        const id = Number(route.params.id)
        // 將轉換後的資料傳給 updateNews
        await newStore.updateNews(id, submissionData)
      } else {
        // 將轉換後的資料傳給 addNews
        await newStore.addNews(submissionData)
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
        <el-select v-model="form.category" placeholder="請選擇分類">
          <el-option label="品牌動態" value="品牌動態" />
          <el-option label="優惠情報" value="優惠情報" />
          <el-option label="活動花絮" value="活動花絮" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="form.date"
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
        <div v-if="form.coverimage" class="coverimage-preview">
          <img :src="form.coverimage" alt="封面預覽" class="coverimage-img" />
        </div>
      </el-form-item>
      <el-form-item label="消息內容" class="editor-wrap">
        <CKEditorComponent v-model="form.content" />
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
