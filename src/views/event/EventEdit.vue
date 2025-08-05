<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CKEditorComponent from '@/components/ckeditor.vue'

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => (isEditMode.value ? '編輯活動' : '新增活動'))

const isReady = ref(false)
const isSubmitting = ref(false)
const loadError = ref(false)
const allTableData = ref([])

const form = reactive({
  activityName: '',
  activityDate: [], // 用於儲存活動日期範圍
  location: {
    area: '',
    address: '',
  },
  cover: '',
  content: '',
  notes: '',
  activityType: '',
  quota: 0,
})

const fetchTableData = async () => {
  // 模擬活動列表資料
  return [
    {
      id: 1,
      activityName: '潮間帶觀察日：跟著老師探訪海岸小生命',
      activityDate: ['2025-08-10 09:00:00', '2025-08-10 13:00:00'],
      location: {
        area: '新北市',
        address: '新北市金山區中角沙珠灣',
      },
      cover: 'https://picsum.photos/800/600',
      content:
        '活動介紹文案內容...<br><br>我們專業的潛水講師老師，一起探索潮間帶的神秘世界！<br>在退潮過後，海岸上會出現一生態豐富的潮汐平台，在這裡你會看到不同的驚喜：螃蟹如何在礁岩縫隙中躲藏？海葵為什麼在這裡探頭？還有彈塗魚跳躍的模樣？<br>不只眼睛看，更要一同「發現潮間帶然奇蹟」的互動體驗。<br>帶上好奇心，來個這個獨一無二的潮水下探險！<br><br>✔ 活動亮點：<br>✔ 專業生態導覽：老師帶你認識潮間帶生物，開啓驚喜生態體驗。<br>✔ 實地觀察互動：近距離觀察海星、海膽、海葵，還有螃蟹移動！<br>✔ 知識與趣味並重：了解潮汐規律、保護生物的重要性。<br>✔ 安全體驗：提供必要的裝備與安全指引，適合親子與自然愛好者。',
      notes: '請穿防滑鞋，自備水壺跟陽傘',
      activityType: '實體行動',
      quota: 20,
    },
    // 其他活動資料...
  ]
}

onMounted(async () => {
  try {
    allTableData.value = await fetchTableData()

    if (isEditMode.value) {
      const id = Number(route.params.id)
      const item = allTableData.value.find((i) => i.id === id)
      if (item) {
        // 深層複製物件，避免直接修改原始數據
        Object.assign(form, JSON.parse(JSON.stringify(item)))
      } else {
        loadError.value = true
      }
    }
  } catch (err) {
    console.error('❌ 資料載入錯誤:', err)
    loadError.value = true
  } finally {
    isReady.value = true
  }
})

const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = () => {
    form.cover = reader.result
  }
  reader.readAsDataURL(file.raw)
}

const handleSubmit = () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  console.log(isEditMode.value ? '編輯送出：' : '新增送出：', form)
  setTimeout(() => {
    // 提交後導回活動列表頁面
    router.push({ name: 'activityList' })
  }, 300)
}

const handleCancel = () => {
  router.back()
}
</script>

<template>
  <div class="content-block-wrapper">
    <header class="content-header">
      <h1 class="content-title">{{ pageTitle }}</h1>
    </header>

    <div v-if="!isReady">載入中...</div>
    <div v-else-if="loadError">找不到該筆資料，請返回列表頁。</div>

    <el-form v-else 
    :model="form" 
    label-width="100px" 
    style="max-width: 800px" 
    label-position="top">
      <el-form-item label="活動名稱">
        <el-input v-model="form.activityName" />
      </el-form-item>

      <el-form-item label="活動日期">
        <el-date-picker
          v-model="form.activityDate"
          type="datetimerange"
          start-placeholder="開始日期時間"
          end-placeholder="結束日期時間"
          format="YYYY-MM-DD HH:mm"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="活動地點">
        <div style="display: flex; gap: 10px; width: 100%;">
          <el-select v-model="form.location.area" placeholder="-選擇地區-" style="width: 150px;">
            <el-option label="台北市" value="台北市" />
            <el-option label="新北市" value="新北市" />
            <el-option label="桃園市" value="桃園市" />
            <el-option label="基隆市" value="基隆市" />
            </el-select>
          <el-input v-model="form.location.address" placeholder="地址" style="flex-grow: 1;" />
        </div>
      </el-form-item>

      <el-form-item label="活動大圖">
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :on-change="handleCoverChange"
          accept="image/*"
        >
          <el-button type="primary">上傳檔案+</el-button>
        </el-upload>

        <div v-if="form.cover" class="cover-preview">
          <img :src="form.cover" alt="活動大圖預覽" class="cover-img" />
        </div>
      </el-form-item>

      <el-form-item label="活動介紹文案">
        <CKEditorComponent v-model="form.content" />
      </el-form-item>

      <el-form-item label="備註">
        <el-input v-model="form.notes" type="textarea" :rows="3" />
      </el-form-item>

      <div class="form-group-inline">
        <el-form-item label="活動分類" style="width: 50%;">
          <el-select v-model="form.activityType" placeholder="請選擇分類">
            <el-option label="實體行動" value="實體行動" />
            <el-option label="淨灘活動" value="淨灘活動" />
            </el-select>
        </el-form-item>

        <el-form-item label="名額" style="width: 50%;">
          <el-input-number v-model="form.quota" :min="1" />
        </el-form-item>
      </div>

      <el-form-item class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
          儲存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.content-title {
  margin: 2rem;
  margin-top: 0;
}
.content-block-wrapper {
  padding: 2rem;
  display: flex;
  align-items: flex-start;
}
.cover-preview {
  margin-top: 1rem;
}
.cover-img {
  max-width: 200px;
  margin: 0 20px;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
}
.form-group-inline {
  display: flex;
  gap: 20px;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>