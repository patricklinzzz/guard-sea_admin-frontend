<script setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useQuizStore } from '@/stores/quiz_store'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()
  const quizStore = useQuizStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯題目' : '新增題目'))

  const isReady = ref(false)
  const isSubmitting = ref(false)
  const loadError = ref(false)
  const allTableData = quizStore.quizzes
  const formRef = ref(null)

  const form = reactive({
    quiz_id: '',
    question_description: '',
    option_1: '',
    option_2: '',
    option_3: '',
    answer: null,
    explanation: '',
  })
  const validateAnswer = (rule, value, callback) => {
    for (let i = 1; i <= 3; i++) {
      const selectedOption = `option_${i}`
      if (!form[selectedOption]) return callback(new Error('答案選項不可空白'))
    }
    callback()
  }
  const rules = {
    quiz_id: [{ required: true, message: '選擇所屬測驗', trigger: 'blur' }],
    question_description: [
      { required: true, message: '題目不可空白', trigger: ['blur', 'change'] },
    ],
    answer: [
      { required: true, message: '選擇答案', trigger: 'change' },
      { validator: validateAnswer, trigger: 'change' },
    ],
    explanation: [{ required: true, message: '解析不可空白', trigger: ['blur', 'change'] }],
  }

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

  const handleSubmit = async () => {
    if (isSubmitting.value || !formRef.value) return
    isSubmitting.value = true

    try {
      await formRef.value.validate()
    } catch (error) {
      ElMessage.error('請檢查表單中的必填欄位。')
      isSubmitting.value = false
      return
    }
    isEditMode.value ? quizStore.editQuestion(form) : quizStore.addQuestionToQuiz(form)

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
    <el-form
      v-else
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      style="max-width: 800px"
    >
      <el-form-item label="題目" prop="question_description">
        <el-input v-model="form.question_description" />
      </el-form-item>
      <el-form-item label="所屬測驗" prop="quiz_id">
        <el-select v-model="form.quiz_id" placeholder="請選擇分類">
          <el-option label="海洋生物" value="1" />
          <el-option label="海洋污染" value="2" />
          <el-option label="過度捕撈" value="3" />
          <el-option label="生態破壞" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="選項答案" prop="answer">
        <el-radio-group v-model="form.answer">
          <el-radio :value="1"><el-input v-model="form.option_1" /></el-radio>
          <el-radio :value="2"><el-input v-model="form.option_2" /></el-radio>
          <el-radio :value="3"><el-input v-model="form.option_3" /></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="解析" prop="explanation">
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
  .el-form-item {
    margin-bottom: 30px;
  }
  .el-radio-group {
    display: flex;
    gap: 20px;
    // display: block;
    .el-radio {
      display: block;

      .el-input {
        width: 400px;
      }
    }
  }
</style>
