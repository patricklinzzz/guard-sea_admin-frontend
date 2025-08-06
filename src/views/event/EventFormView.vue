<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useEventStore } from '@/stores/event_store'

const route = useRoute()
const router = useRouter()
const eventStore = useEventStore()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditMode.value ? '編輯活動' : '新增活動'))

const isReady = ref(false)
const isSubmitting = ref(false)
const loadError = ref(false)

const form = reactive({
  title: '',
  eventDate: [],
  regDeadline: '',
  location: '',
  address: '',
  coverImage: '',
  intro: '',
  content: '',
  regInfo: '',
  note: '',
  category: '',
  quota: '',
})

const dateRange = ref(['2025-08-05 12:00', '2025-08-06 12:00'])

onMounted(async () => {
  if (eventStore.eventData.length === 0) {
    await eventStore.fetchEventData()
  }

  if (isEditMode.value) {
    const id = Number(route.params.id)
    const item = eventStore.eventData.find((i) => i.id === id)
    if (item) {
      Object.assign(form, item)
    } else {
      loadError.value = true
    }
  }
  isReady.value = true
})

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    form.coverImage = reader.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSubmit = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true

  try {
    if (isEditMode.value) {
      const id = Number(route.params.id)
      const index = eventStore.eventData.findIndex((i) => i.id === id)
      if (index !== -1) {
        // 更新原本的活動資料
        eventStore.eventData[index] = { ...form, id }
      } else {
        loadError.value = true
        return
      }
    } else {
      // 新增活動，假設用時間戳當 ID
      const newId = Date.now()
      eventStore.eventData.push({ ...form, id: newId })
    }

    router.push({ name: 'eventlist' })
  } catch (err) {
    console.error('提交資料錯誤:', err)
    ElMessage.error('提交失敗，請稍後再試。')
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
      <el-form-item label="活動名稱">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item label="活動日期">
        <el-date-picker
          v-model="form.eventDate"
          type="datetimerange"
          start-placeholder="開始日期時間"
          end-placeholder="結束日期時間"
          value-format="YYYY-MM-DD HH:mm"
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

      <div class="form-row">
        <el-form-item label="活動地區" class="half">
          <el-select v-model="form.location" placeholder="選擇地區">
            <el-option label="台北" value="台北" />
            <el-option label="新北" value="新北" />
            <el-option label="高雄" value="高雄" />
          </el-select>
        </el-form-item>

        <el-form-item label="地址" class="half">
          <el-input v-model="form.address" />
        </el-form-item>
      </div>

      <el-form-item label="活動大圖">
        <el-upload
          :show-file-list="false"
          :on-change="handleImageChange"
          accept="image/*"
        >
          <el-button type="primary">上傳檔案</el-button>
        </el-upload>
        <div v-if="form.coverImage" class="coverimage-preview">
          <img :src="form.coverImage" alt="封面預覽" class="coverimage-img" />
        </div>
      </el-form-item>

      <el-form-item label="活動介紹">
        <el-input type="textarea" v-model="form.intro" :rows="3" />
      </el-form-item>

      <el-form-item label="活動內容">
        <el-input type="textarea" v-model="form.content" :rows="5" />
      </el-form-item>

      <el-form-item label="報名資訊">
        <el-input type="textarea" v-model="form.regInfo" :rows="3" style="min-height: 100px; resize: none"/>
      </el-form-item>

      <el-form-item label="備註">
        <el-input type="textarea" v-model="form.note" :rows="3" style="min-height: 100px; resize: none"/>
      </el-form-item>

      <div class="form-row">
        <el-form-item label="活動分類" class="half">
          <el-select v-model="form.category" placeholder="選擇分類">
            <el-option label="實體行動" value="實體行動" />
            <el-option label="教育推廣" value="教育推廣" />
            <el-option label="線上參與" value="線上參與" />
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