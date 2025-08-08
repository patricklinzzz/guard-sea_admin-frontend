<script setup>
import { ref, computed } from 'vue'
import TableList from '@/components/tablelist.vue'

const currentPage = ref(1)
const searchTerm = ref('')

const activityList = ref([
    {
        id: 1,
        name: '王大陸',
        email: 'jay3234222@gmail.com',
        phone: '08839324311',
        notes: '無',
    },
    {
        id: 2,
        name: '陳零九',
        email: 'jay3234222@gmail.com',
        phone: '08839324311',
        notes: '不希望出現在公開攝影紀錄中，請協助避拍',
    },
    {
        id: 3,
        name: '陳大天',
        email: 'jay3234222@gmail.com',
        phone: '08839324311',
        notes: '無',
    },
    {
        id: 4,
        name: '大根',
        email: 'jay3234222@gmail.com',
        phone: '08839324311',
        notes: '聽力障礙者參加，會自行攜帶輔具工具',
    },
    {
        id: 5,
        name: '大根',
        email: 'jay3234222@gmail.com',
        phone: '08839324311',
        notes: '無',
    },
    ])

    // 根據 searchTerm 過濾活動名單
    const filteredActivities = computed(() => {
    if (!searchTerm.value) return activityList.value
    return activityList.value.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    })

    // 執行搜尋時，重設頁面為第一頁
    const performSearch = () => {
    currentPage.value = 1
    }
</script>

<template>
    <div class="activity_list_container">
        <form @submit.prevent="performSearch">
        <TableList
            title="活動名單"
            :table-data="filteredActivities"
            :total="filteredActivities.length"
            v-model:current-page="currentPage"
            v-model:search-term="searchTerm"
            :show-search="true"
            search-placeholder="請輸入姓名"
            @search="performSearch"
        >
            <template #default="{ data }">
            <el-table :data="data" style="width: 100%" class="activity_list_table">
                <el-table-column prop="id" label="編號" min-width="80" align="center" />
                <el-table-column prop="name" label="姓名" min-width="150" align="center" />
                <el-table-column prop="email" label="Email" min-width="250" />
                <el-table-column prop="phone" label="電話" min-width="180" align="center" />
                <el-table-column prop="notes" label="備註" min-width="300" />
            </el-table>
            </template>
        </TableList>
        </form>
    </div>
</template>


<style lang="scss" scoped>
    .activity_list_container {
    width: 100%;
    box-sizing: border-box;
}

.activity_list_table {
    :deep(.el-table__cell) {
        padding: 12px 0;
        font-size: 14px;
    }
}
</style>