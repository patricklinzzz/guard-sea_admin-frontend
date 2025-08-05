<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useQuizStore } from '@/stores/quizStore'

  const route = useRoute()
  const router = useRouter()
  const quizStore = useQuizStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯題目' : '新增題目'))

  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)
  const allTableData = quizStore.quizzes

  const form = reactive({
    quiz_id: '',
    question_description: '',
    option_1: '',
    option_2: '',
    option_3: '',
    answer: 0,
    explanation: '',
  })

  onMounted(async () => {
    try {
      // allTableData.value = await fetchTableData()
      if (isEditMode.value) {
        const id = Number(route.params.id)
        const item = allTableData.find((i) => i.question_id == id)
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

  const handleSubmit = () => {
    if (isSubmitting.value) return
    isSubmitting.value = true
    isEditMode.value ? quizStore.editQuestion(form) : quizStore.addQuestionToQuiz(form)
    // console.log(isEditMode.value ? '✔️ 編輯送出：' : '🆕 新增送出：', form)
    setTimeout(() => {
      router.push({ name: 'quizQuestion' })
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
      <el-form-item label="題目">
        <el-input v-model="form.question_description" />
      </el-form-item>
      <el-form-item label="所屬測驗">
        <el-select v-model="form.quiz_id" placeholder="請選擇分類">
          <el-option label="海洋生物" value="1" />
          <el-option label="海洋污染" value="2" />
          <el-option label="過度捕撈" value="3" />
          <el-option label="生態破壞" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="選項答案">
        <el-radio-group v-model="form.answer">
          <el-radio value="1"><el-input v-model="form.option_1" /></el-radio>
          <el-radio value="2"><el-input v-model="form.option_2" /></el-radio>
          <el-radio value="3"><el-input v-model="form.option_3" /></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="解析">
        <el-input v-model="form.explanation" />
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
  .el-radio-group {
    display: flex;
    display: block;
    .el-radio {
      display: block;
      margin-bottom: 20px;
      .el-input {
        width: 400px;
      }
    }
  }
</style>
