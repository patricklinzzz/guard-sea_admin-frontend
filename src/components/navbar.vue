<script setup>
  import { useAuthStore } from '@/stores/auth'
  import { useRoute } from 'vue-router'
  const authStore = useAuthStore()
  import logo from '@/assets/images/logo.svg'

  const route = useRoute()

  const menuItems = [
    { index: '/members', title: '會員管理' },
    { index: '/event', title: '活動管理' },
    { index: '/new', title: '最新消息管理' },
    {
      id: 'edu',
      title: '教育測驗管理',
      children: [
        { index: '/quiz/questions', title: '測驗題目管理' },
        { index: '/quiz/categories', title: '測驗類別管理' },
      ],
    },
    {
      id: 'shop',
      title: '商店管理',
      children: [
        { index: '/product', title: '商品管理' },
        { index: '/order', title: '訂單管理' },
        { index: '/coupon', title: '優惠券管理' },
      ],
    },
    { index: '/admin', title: '管理員設定' },
  ]

  const handleOpen = (key, keyPath) => {
    //console.log(key, keyPath)
  }
  const handleClose = (key, keyPath) => {
    //console.log(key, keyPath)
  }
</script>

<template>
  <el-container class="layout-container">
    <el-aside>
      <router-link to="/" class="logo-router-link">
        <div class="logo-container">
          <img :src="logo" alt="" class="logo" />
          <h2>後台管理</h2>
        </div>
      </router-link>
      <el-menu :default-active="route.path" router @open="handleOpen" @close="handleClose">
        <template v-for="item in menuItems" :key="item.index || item.id">
          <el-sub-menu v-if="item.children" :index="item.id">
            <template #title>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
              {{ child.title }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.index">
            <span>{{ item.title }}</span>
          </el-menu-item>
        </template>

        <el-menu-item @click="authStore.logout()" index="logout">
          <span>登出</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
  h2 {
    font-size: 1.125em;
  }
  .layout-container {
    height: 100vh;
  }
  .el-aside {
    width: fit-content;
    background-color: #012038;
    display: flex;
    flex-direction: column;
  }
  .el-main {
    overflow-y: auto;
  }
  .el-menu {
    --el-menu-active-color: #ec6c26;
    --el-menu-bg-color: transparent;
    --el-menu-text-color: #fff;
    --el-menu-hover-bg-color: #001529;
    width: fit-content;
    flex-grow: 1;
    border-right: none;
    .el-menu-item,
    :deep(.el-sub-menu__title) {
      font-size: 1.125em;
    }
    .el-button {
      float: right;
      margin-right: 20px;
      margin-top: 20px;
    }
  }
  .logo-router-link {
    text-decoration: none;
  }
  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    padding: 20px 0;
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
