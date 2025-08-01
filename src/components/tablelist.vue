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
          style="width: 150px"
        >
          <el-option :label="`${props.allLabel}(${totalCount})`" value="all" />
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

    // 由父層傳入分類選單資料
    categoryOptions: { type: Array, default: () => [] },
    allLabel: { type: String, default: '' },
    //由父層決定要搜尋的欄位
    searchKey: { type: String, default: 'title' },
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
  header {
    margin-bottom: 10px;
  }
  .content-block-wrapper {
    padding: 58px 40px 40px 35px;
    // padding: 3.8% 0px 0px 40px;

    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 98%;

    .content-header {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: center;
      padding-right: 120px;

      .content-title {
        min-width: 180px;
        font-size: 24px;
        font-weight: bold;
      }

      .header-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;

        > * {
          flex-shrink: 0;
        }

        .input-with-select {
          width: 250px;
          flex: 0 0 auto;
        }
        //  新增按鈕
        :deep(.el-button) {
          font-size: 18px;
          height: 36px;
        }

        //  分類下拉選單
        :deep(.el-select__wrapper) {
          font-size: 18px;
          height: 36px;
        }

        //  搜尋框
        :deep(.el-input__wrapper) {
          font-size: 18px;
          height: 36px;
        }
        :deep(.el-input__inner) {
          font-size: 18px;
          min-width: 0;
          flex: 1 1 auto;
        }
      }
    }

    :deep(.el-table__body .el-table__cell) {
      border-bottom: 1px solid hsla(206, 96%, 11%, 0.5) !important; // 改為你喜歡的樣式
    }

    :deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb) {
      background-color: #47a1ff; // 自訂滾動條顏色
      border-radius: 8px;
    }

    .content-main {
      :deep(.el-scrollbar__bar) {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
        transition: none !important;
      }

      :deep(.el-scrollbar__thumb) {
        background-color: #012038;
      }

      :deep(.el-table__header th.el-table__cell) {
        background-color: #d2d7dc !important;
        color: #012038;
        font-size: 20px;
        height: 70px;
      }

      :deep(.el-table .cell) {
        padding: 0px 20px;
      }

      :deep(.el-table__body .el-table__cell .cell) {
        font-size: 18px;
      }
    }
    .content-footer {
      display: flex;
      justify-content: center;
      padding-top: 16px;
    }
  }
</style>
