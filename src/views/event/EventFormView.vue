<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { useEventStore } from '@/stores/event_store'
  import axios from 'axios'

  const route = useRoute()
  const router = useRouter()
  const eventStore = useEventStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯活動' : '新增活動'))

  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)

  const form = reactive({
    id: null,
    title: '',
    eventDate: [],
    regDeadline: '',
    location: '',
    address: '',
    intro: '',
    content: '',
    note: '',
    category_id: null,
    quota: '',
    presenter: '',
  })

  const coverImageFile = ref(null)
  const imagePreviewUrl = ref('')

  const API_BASE_URL = 'http://localhost:8888/guard-sea_api'

  const getFullLocation = (location, address) => {
    if (location && address) {
      return `${location} ${address}`
    }
    return location || address || ''
  }

  const getCategoryNameById = (id) => {
    switch (id) {
      case 1:
        return '實體行動'
      case 2:
        return '教育推廣'
      case 3:
        return '線上參與'
      default:
        return ''
    }
  }

  const initForm = async () => {
    if (isEditMode.value) {
      const id = Number(route.params.id)
      const item = eventStore.eventData.find((i) => Number(i.id) === id)

      if (item) {
        form.id = item.id
        form.title = item.title || ''
        form.eventDate = [item.start_date, item.end_date]
        form.regDeadline = item.registration_close_date
          ? item.registration_close_date.split(' ')[0]
          : ''

        if (item.location) {
          const parts = item.location.split(' ')
          form.location = parts.length > 1 ? parts[0] : ''
          form.address = parts.length > 1 ? parts.slice(1).join(' ') : parts[0]
        } else {
          form.location = ''
          form.address = ''
        }

        form.intro = item.preface || ''
        form.content = item.description || ''
        form.note = item.notes || ''
        form.presenter = item.presenter || ''

        form.category_id = parseInt(item.category, 10) || null

        form.quota = item.quota || ''

        if (item.image_url) {
          imagePreviewUrl.value = `${API_BASE_URL}${item.image_url}`
        }
      } else {
        loadError.value = true
      }
    }
  }

  onMounted(async () => {
    try {
      await eventStore.fetchEventData()
      initForm()
    } catch (err) {
      console.error('頁面載入失敗:', err)
      loadError.value = true
      ElMessage.error('載入資料失敗，請檢查網路或稍後再試。')
    } finally {
      isReady.value = true
    }
  })

  const handleImageChange = (file) => {
    coverImageFile.value = file.raw
    imagePreviewUrl.value = URL.createObjectURL(file.raw)
  }

  const handleSubmit = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    try {
      if (!form.title) {
        ElMessage.error('請填寫活動名稱')
        isSubmitting.value = false
        return
      }
      if (!form.eventDate || form.eventDate.length < 2) {
        ElMessage.error('請填寫活動日期')
        isSubmitting.value = false
        return
      }
      if (!form.regDeadline) {
        ElMessage.error('請填寫報名截止日期')
        isSubmitting.value = false
        return
      }
      if (!form.category_id) {
        ElMessage.error('請選擇活動分類')
        isSubmitting.value = false
        return
      }

      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('preface', form.intro || '')
      formData.append('description', form.content || '')
      formData.append('start_date', form.eventDate[0])
      formData.append('end_date', form.eventDate[1])
      formData.append('location', getFullLocation(form.location, form.address))
      formData.append('quota', form.quota ? parseInt(form.quota) : 0)
      formData.append('registration_close_date', form.regDeadline + ' 23:59:59')
      formData.append('status', '報名中')
      formData.append('notes', form.note || '')
      formData.append('category_id', form.category_id)
      formData.append('presenter', form.presenter || '')

      if (coverImageFile.value) {
        formData.append('image_file', coverImageFile.value)
      }

      const apiPath = isEditMode.value ? 'update_event.php' : 'add_event.php'
      const fullUrl = `${API_BASE_URL}/events/${apiPath}`

      if (isEditMode.value) {
        formData.append('id', form.id)
      }

      const response = await axios.post(fullUrl, formData)
      console.log(response.data)
      if (response.data.status === 'success') {
        ElMessage.success(isEditMode.value ? '活動編輯成功！' : '活動新增成功！')

        if (response.data.image_url) {
          imagePreviewUrl.value = `${API_BASE_URL}/${response.data.image_url}`
        }

        router.push({ name: 'eventlist' })
      } else {
        const errorMessage = response.data.message || '操作失敗，請稍後再試。'
        ElMessage.error(`提交失敗：${errorMessage}`)
      }
    } catch (err) {
      console.error('提交資料時發生錯誤:', err.response?.data || err.message)
      ElMessage.error('提交失敗，請檢查網路連線或稍後再試。')
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

    <div v-if="!isReady" class="loading-state">載入中...</div>
    <div v-else-if="loadError" class="error-state">找不到該筆資料，請返回列表頁。</div>

    <el-form
      v-else
      :model="form"
      label-width="100px"
      style="max-width: 800px"
      @submit.prevent="handleSubmit"
    >
      <el-form-item label="活動名稱">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="活動日期">
        <el-date-picker
          v-model="form.eventDate"
          type="datetimerange"
          start-placeholder="開始日期時間"
          end-placeholder="結束日期時間"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="報名截止">
        <el-date-picker
          v-model="form.regDeadline"
          type="date"
          placeholder="選擇截止日期"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="主講人">
        <el-input v-model="form.presenter" placeholder="請輸入主講人" />
      </el-form-item>

      <div class="form-row">
        <el-form-item label="活動地區" class="half">
          <el-select v-model="form.location" placeholder="選擇地區">
            <el-option label="台北" value="台北" />
            <el-option label="新北" value="新北" />
            <el-option label="基隆" value="基隆" />
            <el-option label="桃園" value="桃園" />
            <el-option label="宜蘭" value="宜蘭" />
            <el-option label="花蓮" value="花蓮" />
            <el-option label="台東" value="台東" />
            <el-option label="新竹" value="新竹" />
            <el-option label="苗栗" value="苗栗" />
            <el-option label="台中" value="台中" />
            <el-option label="南投" value="南投" />
            <el-option label="彰化" value="彰化" />
            <el-option label="嘉義" value="嘉義" />
            <el-option label="台南" value="台南" />
            <el-option label="高雄" value="高雄" />
            <el-option label="小琉球" value="小琉球" />
            <el-option label="金門" value="金門" />
            <el-option label="馬祖" value="馬祖" />
            <el-option label="綠島" value="綠島" />
            <el-option label="蘭嶼" value="蘭嶼" />
          </el-select>
        </el-form-item>

        <el-form-item label="地址" class="half">
          <el-input v-model="form.address" />
        </el-form-item>
      </div>

      <el-form-item label="活動大圖">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleImageChange"
          accept="image/*"
        >
          <el-button type="primary">上傳檔案</el-button>
        </el-upload>
        <div v-if="imagePreviewUrl" class="coverimage-preview">
          <img :src="imagePreviewUrl" alt="封面預覽" class="coverimage-img" />
        </div>
      </el-form-item>

      <el-form-item label="活動介紹">
        <el-input type="textarea" v-model="form.intro" :rows="3" />
      </el-form-item>

      <el-form-item label="活動內容">
        <el-input type="textarea" v-model="form.content" :rows="5" />
      </el-form-item>

      <el-form-item label="備註">
        <el-input
          type="textarea"
          v-model="form.note"
          :rows="3"
          style="min-height: 100px; resize: none"
        />
      </el-form-item>

      <div class="form-row">
        <el-form-item label="活動分類" class="half">
          <el-select v-model="form.category_id" placeholder="選擇分類">
            <el-option label="實體行動" :value="1" />
            <el-option label="教育推廣" :value="2" />
            <el-option label="線上參與" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="名額" class="half">
          <el-input v-model="form.quota" />
        </el-form-item>
      </div>

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
    margin: 0 1rem;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }

  .form-row {
    display: flex;
    gap: 20px;

    .half {
      flex: 1;
    }
  }

  ::v-deep(.el-textarea__inner) {
    resize: none;
  }
</style>
