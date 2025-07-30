<script setup>
  import ckeditor from '@/components/ckeditor.vue'
  import { ref } from 'vue'
  import axios from 'axios'
  const editorContent = ref('')

  const saveContent = async () => {
    console.log('準備發送到後端的內容:', editorContent.value)
    try {
      const response = await axios.post('/api/save-editor-content', {
        // 替換為你的實際後端端點
        content: editorContent.value,
      })
      console.log('內容儲存成功:', response.data)
      alert('內容已成功儲存！')
    } catch (error) {
      console.error('儲存內容失敗:', error)
      alert('儲存內容失敗，請檢查控制台！')
    }
  }
</script>

<template>
  <ckeditor></ckeditor>
</template>

<style scoped lang="scss"></style>
