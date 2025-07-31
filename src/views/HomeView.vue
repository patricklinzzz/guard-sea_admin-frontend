<script setup>
  import { useAuthStore } from '@/stores/auth'
  const authStore = useAuthStore()
</script>

<template>
  <main>
    <h1>歡迎回來, {{ authStore.user?.name }}!</h1>
    <p>這裡是登入後才能看到的後台首頁。</p>
    <p>
      您的 Token 是:
      <code>{{ authStore.token }}</code>
    </p>
  </main>
</template>

<style scoped lang="scss">
  code {
    background-color: #f4f4f5;
    color: #909399;
    padding: 2px 4px;
    border-radius: 4px;
    word-break: break-all;
  }
</style>
