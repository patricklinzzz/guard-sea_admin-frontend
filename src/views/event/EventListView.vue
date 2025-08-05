<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { Edit } from '@element-plus/icons-vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    import Tablelist from '@/components/tablelist.vue'
    import { useEventStore } from '@/stores/event'

    const router = useRouter()
    const store = useEventStore()

    const currentPage = ref(1)
    const selectedCategory = ref('')
    const searchText = ref('')
    // const allTableData = ref([])
    const searchKey = ref('title')

    // computed 屬性，用來過濾表格資料
    const filteredData = computed(() => {
    let data = [...store.allTableData]
    if (selectedCategory.value !== '') {
        data = data.filter((item) => item.category === selectedCategory.value)
    }
    if (searchText.value.trim()) {
        const keyword = searchText.value.trim().toLowerCase()
        const key = searchKey.value
        data = data.filter((item) => {
        const field = item[key]
        return field?.toString().toLowerCase().includes(keyword)
        })
    }
    return data
    })

    watch([selectedCategory, searchText], () => {
    currentPage.value = 1
    })

    onMounted(() => {
    store.fetchTableData()
    })

    const handleAddEvent = () => {
    router.push({ name: 'eventAdd' })
    }

    const handleEdit = (row) => {
    router.push({ name: 'eventEdit', params: { id: row.id } })
    }

    const handleList = (id) => {
    router.push({ name: 'eventMember', params: { id } })
    }

    const handleStatusChange = (id, newStatus) => {
    store.updateEventStatus(id, newStatus)
    }
</script>

<template>
    <div class="page-container">
        <Tablelist
        title="活動管理"
        :total="filteredData.length"
        v-model:currentPage="currentPage"
        :table-data="filteredData"
        :category-options="store.categoryOptions"
        :show-add-button="true"
        add-button-text="+ 新增活動"
        @add="handleAddEvent"
        :show-category-filter="true"
        v-model:category="selectedCategory"
        :show-search="true"
        search-placeholder="請輸入標題關鍵字"
        v-model:searchTerm="searchText"
        :search-key="searchKey"
        all-label="全部活動"
        :page-size="5"
        >
        <template #default="scope">
            <el-table :data="scope.data" stripe style="width: 100%">
            <el-table-column prop="title" label="活動名稱" width="180" />
            <el-table-column prop="category" label="活動分類" width="120" align="center" />
            <el-table-column prop="deadline" label="報名截止" width="140" align="center" />
            <el-table-column prop="date" label="活動日期" width="180" align="center" />
            <el-table-column prop="quota" label="名額" width="80" align="center" />
            <el-table-column label="名單查詢" width="120" align="center">
                <template #default="scope">
                <el-button link type="primary" @click="handleList(scope.row.id)"> >></el-button>
                </template>
            </el-table-column>
            <el-table-column label="編輯" width="80" align="center">
                <template #default="scope">
                <el-button link type="primary" @click="handleEdit(scope.row)">
                    <el-icon><Edit /></el-icon>
                </el-button>
                </template>
            </el-table-column>
            <el-table-column label="狀態" width="120" align="center">
                <template #default="scope">
                <el-select
                    v-model="scope.row.status"
                    size="small"
                    @change="(val) => handleStatusChange(scope.row.id, val)"
                >
                    <el-option label="報名中" value="registering" />
                    <el-option label="已截止" value="closed" />
                    <el-option label="已結束" value="ended" />
                    <el-option label="已取消" value="cancelled" />
                </el-select>
                </template>
            </el-table-column>
            </el-table>
        </template>
        </Tablelist>
    </div>
</template>

<style>
    .page-container {
    width: 100%;
    box-sizing: border-box;
    }

    :deep(.el-select--small .el-select__wrapper) {
    font-size: 18px;
    height: 30px;
    }

    .el-select-dropdown__item {
    font-size: 18px;
    }

    .el-button.is-link {
    transform: scale(1.7);
    }
</style>