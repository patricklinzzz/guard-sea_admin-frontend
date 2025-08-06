<script setup>
  import { RouterLink } from 'vue-router'
</script>

<template>
  <h2>後台總覽</h2>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card style="max-width: 300px">
        <p>今日新增會員</p>
        <h1 id="number">123</h1>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card style="max-width: 300px">
        <p>今日訂單</p>
        <h1 id="number">123</h1>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card style="max-width: 300px">
        <p>今日報名人數</p>
        <h1 id="number">123</h1>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card style="max-width: 300px">
        <p>進行中活動</p>
        <h1 id="number">123</h1>
      </el-card>
    </el-col>
  </el-row>

  <h2>快捷功能區</h2>
  <el-row :gutter="20">
    <el-col :span="4">
      <router-link to="/event/add">
        <el-card style="max-width: 300px">
          <p>+ 新增活動</p>
        </el-card>
      </router-link>
    </el-col>
    <el-col :span="4">
      <router-link to="/new/add">
        <el-card style="max-width: 300px">
          <p>+ 新增消息</p>
        </el-card>
      </router-link>
    </el-col>
    <el-col :span="4">
      <router-link to="/product/add">
        <el-card style="max-width: 300px">
          <p>+ 新增商品</p>
        </el-card>
      </router-link>
    </el-col>
    <el-col :span="5">
      <router-link to="/quiz/questions/add">
        <el-card style="max-width: 300px">
          <p>+ 新增測驗題目</p>
        </el-card>
      </router-link>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss">
  h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }
  #number {
    font-size: 40px;
    font-weight: normal;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-row:last-child {
    margin-bottom: 0;
  }
  .el-row:nth-child(4) {
    text-align: center;
    cursor: pointer;
  }
  .el-col {
    border-radius: 4px;
    p {
      font-size: 16px;
    }
  }
</style>
