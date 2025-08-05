<template>
  <div class="add-event">
    <h2>新增活動</h2>

    <el-form :model="form" label-width="100px">
      <el-form-item label="活動名稱">
        <el-input v-model="form.name" placeholder="輸入活動名稱" />
      </el-form-item>

      <el-form-item label="活動日期">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="報名截止">
        <el-date-picker
          v-model="form.deadline"
          type="date"
          placeholder="選擇截止日期"
          format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="活動地區">
        <el-select v-model="form.area" placeholder="--選擇地區--">
          <el-option v-for="area in areaOptions" :key="area" :label="area" :value="area" />
        </el-select>
      </el-form-item>

      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder="輸入地址" />
      </el-form-item>

      <el-form-item label="活動大圖">
        <el-upload
          action="#"
          :show-file-list="false"
          :on-change="handleImageUpload"
        >
          <el-button>上傳檔案+</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="活動內容">
        <CKEditorComponent :editor="editor" v-model="form.content" :config="editorConfig" />
      </el-form-item>

      <el-form-item label="備註">
        <el-input v-model="form.note" type="textarea" />
      </el-form-item>

      <el-form-item label="活動分類">
        <el-select v-model="form.category" placeholder="--選擇分類--">
          <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
        </el-select>
      </el-form-item>

      <el-form-item label="名額">
        <el-input-number v-model="form.quota" :min="1" />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">新增</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import CKEditorComponent from '@/components/ckeditor.vue'

defineProps(['modelValue', 'editor', 'config'])
defineEmits(['update:modelValue'])

const editor = ClassicEditor
const editorConfig = {
  toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload', 'undo', 'redo']
}

const form = ref({
  name: '',
  date: [],
  deadline: '',
  area: '',
  address: '',
  image: null,
  content: '',
  note: '',
  category: '',
  quota: 0
})

const areaOptions = ['北部', '中部', '南部', '東部', '離島']
const categoryOptions = ['海洋生態', '環境保護', '志工服務', '教育推廣']

const handleImageUpload = (file) => {
  form.value.image = file.raw
  ElMessage.success('圖片已上傳')
}

const handleSubmit = () => {
  console.log('提交資料', form.value)
  ElMessage.success('活動已新增')
}

const handleCancel = () => {
  ElMessage.info('已取消')
}
</script>

<style scoped>
.add-event {
  max-width: 800px;
  margin: 0 auto;
}
</style>
