<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { RouterLink } from 'vue-router'
  const authStore = useAuthStore()
  import logo from '@/assets/images/logo.svg'
  const handleOpen = (key, keyPath) => {
    // console.log(key, keyPath)
  }
  const handleClose = (key, keyPath) => {
    // console.log(key, keyPath)
  }
</script>

<template>
  <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
    <router-link to="/">
      <div class="logo-container">
        <img :src="logo" alt="" class="logo" />
        <h2>後台管理</h2>
      </div>
    </router-link>
    <el-menu-item index="1">
      <router-link to="/連結放這">
        <h3>會員管理</h3>
      </router-link>
    </el-menu-item>

    <el-menu-item index="2">
      <router-link to="/">
        <h3>活動管理</h3>
      </router-link>
    </el-menu-item>

    <el-menu-item index="3">
      <router-link to="/new">
        <h3>最新消息管理</h3>
      </router-link>
    </el-menu-item>

    <el-sub-menu index="4">
      <template #title>
        <router-link to="/">
          <h3>教育測驗管理</h3>
        </router-link>
      </template>
      <el-menu-item index="4-1">
        <router-link to="/">
          <h3>測驗類別管理</h3>
        </router-link>
      </el-menu-item>
      <el-menu-item index="4-2">
        <router-link to="/">
          <h3>測驗題目管理</h3>
        </router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <router-link to="/">
          <h3>商店管理</h3>
        </router-link>
      </template>
      <el-menu-item index="5-1">
        <router-link to="/">
          <h3>商品管理</h3>
        </router-link>
      </el-menu-item>
      <el-menu-item index="5-2">
        <router-link to="/">
          <h3>訂單管理</h3>
        </router-link>
      </el-menu-item>
      <el-menu-item index="5-3">
        <router-link to="/">
          <h3>優惠券管理</h3>
        </router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="6">
      <router-link to="/">
        <h3>管理員設定</h3>
      </router-link>
    </el-menu-item>

    <el-menu-item index="7">
      <h3 @click="authStore.logout()">登出</h3>
    </el-menu-item>
  </el-menu>
  <router-view></router-view>
</template>

<style scoped lang="scss">
  h2,
  h3 {
    font-size: 1.125em;
  }
  .el-menu {
    --el-menu-active-color: #ec6c26;
    --el-menu-bg-color: #012038;
    --el-menu-text-color: #fff;
    --el-menu-hover-bg-color: #001529;
    width: fit-content;
    min-height: 100vh;
    border-right: none;
    .el-button {
      float: right;
      margin-right: 20px;
      margin-top: 20px;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
  }
  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    padding: 10px 0 10px;
    gap: 10px;
    .logo {
      height: 2em;
      display: block;
    }
  }
  :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
    color: var(--el-menu-active-color) !important;
  }
</style>
