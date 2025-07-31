<template>
  <div class="content-block-wrapper">
    <!-- 頂部標題與操作區 -->
    <header class="content-header">
      <h2 class="content-title">{{ title }}</h2>

      <div class="header-actions">
        <!-- 1. 新增按鈕 -->
        <el-button v-if="showAddButton" type="primary" @click="emit('add')">
          {{ addButtonText }}
        </el-button>

        <!-- 2. 分類下拉選單（由父層傳入 categoryOptions） -->
        <el-select
          v-if="showCategoryFilter"
          :model-value="category"
          @update:modelValue="emit('update:category', $event)"
          placeholder="請選擇分類"
          style="width: 230px"
        >
          <el-option :label="`全部 (${totalCount})`" value="all" />
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="`${item.label} (${item.count})`"
            :value="item.value"
          />
        </el-select>

        <!-- 3. 搜尋框 -->
        <el-input
          v-if="showSearch"
          :model-value="searchTerm"
          @update:modelValue="emit('update:searchTerm', $event)"
          :placeholder="searchPlaceholder"
          class="input-with-select"
          clearable
          @keyup.enter="emit('search')"
        >
          <template #append>
            <el-button :icon="Search" @click="emit('search')" />
          </template>
        </el-input>
      </div>
    </header>

    <!-- 資料內容 slot -->
    <main class="content-main">
      <slot :data="paginatedData"></slot>
    </main>

    <!-- 分頁 -->
    <footer v-if="total > 0" class="content-footer">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handlePageChange"
      />
    </footer>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { Search } from '@element-plus/icons-vue'

  const props = defineProps({
    title: { type: String, required: true },
    total: { type: Number, required: true },
    currentPage: { type: Number, required: true },
    tableData: { type: Array, required: true },

    showAddButton: { type: Boolean, default: false },
    showCategoryFilter: { type: Boolean, default: false },
    showSearch: { type: Boolean, default: false },

    addButtonText: { type: String, default: '+ 新增' },
    searchPlaceholder: { type: String, default: '請輸入關鍵字' },

    category: { type: String, default: 'all' },
    searchTerm: { type: String, default: '' },

    // 新增：由父層傳入分類選單資料
    categoryOptions: { type: Array, default: () => [] },
  })

  const emit = defineEmits([
    'update:currentPage',
    'update:category',
    'update:searchTerm',
    'add',
    'search',
  ])

  const pageSize = 5

  const paginatedData = computed(() => {
    const start = (props.currentPage - 1) * pageSize
    const end = start + pageSize
    return props.tableData.slice(start, end)
  })

  //  使用傳入的 categoryOptions 計算全部總筆數
  const totalCount = computed(() =>
    props.categoryOptions.reduce((sum, item) => sum + item.count, 0)
  )

  const handlePageChange = (newPage) => {
    emit('update:currentPage', newPage)
  }
</script>

<style lang="scss" scoped>
  .content-block-wrapper {
    max-width: 1600px;
    margin: 0 auto;
    padding: 24px;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .content-title {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    .content-main {
      :deep(.el-table) {
        width: 100%;
      }
    }

    .content-footer {
      display: flex;
      justify-content: center;
      padding-top: 16px;
    }
  }
</style>
