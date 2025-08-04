<script setup>
    import { ref, computed, watch, onMounted } from 'vue'
    import { Edit } from '@element-plus/icons-vue'
    import { useRouter } from 'vue-router'
    import { ElMessageBox, ElMessage } from 'element-plus'
    import Tablelist from '@/components/tablelist.vue'

    const router = useRouter()

    const currentPage = ref(1)
    const selectedCategory = ref('')
    const searchText = ref('')
    const allTableData = ref([])
    const searchKey = ref('title')

    const fetchTableData = async () => {
        // fetchError.value = null
        try {
        // 未來這裡直接換成 fetch或axios.get(url) 就行
        const fakeData = [
            {
            id: 1,
            title: '淨灘活動：用雙手還給海洋純淨',
            category: '實體行動',
            deadline: '2025.11.23',
            date: '2025.11.28(六) 09:00 - 12:00',
            quota: 100,
            status: 'registering',
            },
            {
            id: 2,
            title: '教育講座：深度認識海洋',
            category: '教育推廣',
            deadline: '2025.11.15',
            date: '2025.11.20(四) 10:00 - 13:00',
            quota: 200,
            status: 'registering',
            },
            {
            id: 3,
            title: '海底漫遊live：水下攝影即時導覽',
            category: '線上參與',
            deadline: '2025.01.08',
            date: '2025.11.13(四) 20:00 - 21:00',
            quota: 150,
            status: 'registering',
            },
            {
            id: 4,
            title: '海上瑜珈&日出冥想',
            category: '實體行動',
            deadline: '2025.11.03',
            date: '2025.11.08(六) 05:30 - 07:00',
            quota: 30,
            status: 'registering',
            },
            {
            id: 5,
            title: '深海奇遇：3D',
            category: '教育推廣',
            deadline: '2025.10.25',
            date: '2025.11.01(六) 14:00 - 16:00',
            quota: 100,
            status: 'registering',
            },
            {
            id: 6,
            title: '夜間潮間帶探索活動',
            category: '實體行動',
            deadline: '2025.10.25',
            date: '2025.10.30(四) 19:00 - 21:00',
            quota: 20,
            status: 'registering',
            },
            {
            id: 7,
            title: '餐桌上的海洋：永續漁業探索',
            category: '教育推廣',
            deadline: '2025.10.16',
            date: '2025.10.21(二) 14:00 - 16:00',
            quota: 80,
            status: 'registering',
            },
            {
            id: 8,
            title: '海的聲音：鯨豚聲音導聽工作坊',
            category: '線上參與',
            deadline: '2025.10.12',
            date: '2025.10.17(五) 19:30 - 21:00',
            quota: 150,
            status: 'registering',
            },
            {
            id: 9,
            title: '微塑膠在哪裡？沙灘採樣與顯微觀察體驗',
            category: '實體行動',
            deadline: '2025.10.06',
            date: '2025.10.11(六) 10:00 - 14:00',
            quota: 25,
            status: 'registering',
            },
            {
            id: 10,
            title: '打造你的海洋行動提案',
            category: '實體行動',
            deadline: '2025.09.25',
            date: '2025.10.01(三) 13:00 - 17:00',
            quota: 40,
            status: 'registering',
            },
            {
            id: 11,
            title: '環保漁港導覽與清港行動',
            category: '實體行動',
            deadline: '2025.09.16',
            date: '2025.09.21(日) 09:00 - 16:00',
            quota: 50,
            status: 'registering',
            },
            {
            id: 12,
            title: '海洋藝術創作工作坊',
            category: '教育推廣',
            deadline: '2025.08.26',
            date: '2025.09.01(一) 13:00 - 17:00',
            quota: 30,
            status: 'registering',
            },
            {
            id: 13,
            title: '無塑海灘：社區淨灘與廢棄物記錄工作坊',
            category: '實體行動',
            deadline: '2025.0808',
            date: '2025.08.13(日) 09:00 - 13:00',
            quota: 60,
            status: 'registering',
            },
            {
            id: 14,
            title: '線上海洋講座：解謎深海',
            category: '線上參與',
            deadline: '2025.07.25',
            date: '2025.07.30(一) 20:00 - 21:30',
            quota: 150,
            status: 'registering',
            },
            {
            id: 15,
            title: '海洋知識線上問答賽',
            category: '線上參與',
            deadline: '2025.07.21',
            date: '2025.07.26(日) 14:00 - 15:00',
            quota: 20,
            status: 'registering',
            },
            {
            id: 16,
            title: '珊瑚復育志工體驗營',
            category: '實體行動',
            deadline: '2025.07.07',
            date: '2025.07.12(六) 08:30 - 17:00',
            quota: 5,
            status: 'registering',
            },
        ]

        // 模擬成功結果
        allTableData.value = fakeData
        return fakeData
        } catch (err) {
        fetchError.value = '資料載入失敗，請稍後再試'
        console.error('Fetch 錯誤：', err)
        return []
        }
    }


onMounted(fetchTableData)

    const categoryOptions = computed(() => {
    const counts = {}
    allTableData.value.forEach((item) => {
        if (item.category) {
        counts[item.category] = (counts[item.category] || 0) + 1
        }
    })

    return Object.entries(counts).map(([key, count]) => ({
        label: key,
        value: key,
        count,
    }))
    })

    const filteredData = computed(() => {
    let data = [...allTableData.value]
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

    const handleAddEvent = () => {
    router.push({ name: 'eventAdd' })
    }

    const handleEdit = (row) => {
    router.push({ name: 'activityEdit', params: { id: row.id } })
    }

    const handleList = (id) => {
    router.push({ name: 'activityList', params: { id } })
    }

    const handleStatusChange = (id, newStatus) => {
    const target = allTableData.value.find(item => item.id === id)
    if (target) {
        target.status = newStatus
        // axios.patch(`/api/activities/${id}`, { status: newStatus }) 可放這裡
    }
    }
</script>

<template>
    <div class="page-container">
        <!-- Tablelist 包裝 -->
        <Tablelist
        title="活動管理"
        :total="filteredData.length"
        v-model:currentPage="currentPage"
        :table-data="filteredData"
        :category-options="categoryOptions"
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
                <el-button link type="primary" @click="handleList(scope.row.id)">>></el-button>
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
                    @change="val => handleStatusChange(scope.row.id, val)"
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