<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import CKEditorComponent from '@/components/ckeditor.vue'

  const route = useRoute()
  const router = useRouter()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯消息內容' : '新增消息內容'))

  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)
  const allTableData = ref([])

  const form = reactive({
    title: '',
    category: '',
    date: '',
    display: true,
    content: '',
    cover: '', // 新增封面圖片欄位
  })

  const fetchTableData = async () => {
    return [
      {
        id: 1,
        category: '品牌動態',
        cover: '',
        title: '徵才公告：我們正在尋找充滿熱情的潛水教練和網站前端工程師，快來加入我們吧！',
        date: '2025-07-09',
        status: 'published',
      },
      {
        id: 2,
        category: '優惠情報',
        cover: '',
        title: '夏季限定！兩人同行，一人免費潛水體驗課程。',
        date: '2025-07-08',
        status: 'draft',
      },
      {
        id: 3,
        category: '活動花絮',
        cover: '',
        title: '感謝大家參與上週末的淨灘活動，海洋因你而更美麗。',
        date: '2025-06-02',
        status: 'published',
      },
      {
        id: 4,
        category: '品牌動態',
        cover: '',
        title: '全新系列蛙鞋與面鏡震撼上市，帶來前所未有的水下視野。',
        date: '2025-07-07',
        status: 'published',
      },
      {
        id: 5,
        category: '優惠情報',
        cover: '',
        title: 'VIP 會員專屬，全館裝備享 85 折特惠。',
        date: '2025-07-07',
        status: 'published',
      },
      {
        id: 6,
        category: '活動花絮',
        cover: '',
        title: '我們的團隊成為了海洋保育署的年度環保志工夥伴。',
        date: '2025-07-07',
        status: 'published',
      },
      {
        id: 7,
        category: '優惠情報',
        cover: '',
        title: '結帳輸入「DIVE2025」即可獲得 200 元折扣碼。',
        date: '2025-07-07',
        status: 'published',
      },
    ]
  }

  onMounted(async () => {
    try {
      allTableData.value = await fetchTableData()

      if (isEditMode.value) {
        const id = Number(route.params.id)
        const item = allTableData.value.find((i) => i.id === id)
        if (item) {
          Object.assign(form, item)
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
    console.log(isEditMode.value ? '✔️ 編輯送出：' : '🆕 新增送出：', form)
    setTimeout(() => {
      router.push({ name: 'newlist' })
    }, 300)
  }

  const handleCancel = () => {
    router.back()
  }
</script>

<template>
  <div class="content-block-wrapper">
    <header class="content-header">
      <h2 class="content-title">{{ pageTitle }}</h2>
    </header>

    <div v-if="!isReady">⏳ 載入中...</div>
    <div v-else-if="loadError">❌ 找不到該筆資料，請返回列表頁。</div>

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
          :on-change="handleCoverChange"
          accept="image/*"
        >
          <el-button type="primary">選擇圖片</el-button>
        </el-upload>

        <div v-if="form.cover" class="cover-preview">
          <img :src="form.cover" alt="封面預覽" class="cover-img" />
        </div>
      </el-form-item>

      <el-form-item label="消息內容">
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
  .cover-preview {
    margin-top: 1rem;
  }
  .cover-img {
    max-width: 200px;
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);
  }
</style>
