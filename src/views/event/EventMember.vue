<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRegistrationStore } from '@/stores/registration_store'
import TableList from '@/components/tablelist.vue'

const currentPage = ref(1)
const searchTerm = ref('')
const route = useRoute()

// 報名名單 store
const registrationStore = useRegistrationStore()

// 頁面載入時抓取名單
onMounted(() => {
    const eventId = route.params.id // 假設網址是 /admin/event/:id/registrations
    if (eventId) {
        registrationStore.fetchRegistrationByEvent(eventId)
    }
})

// 根據 searchTerm 過濾報名名單
const filteredRegistrations = computed(() => {
    if (!searchTerm.value) return registrationStore.registrationList
    return registrationStore.registrationList.filter((a) =>
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
            :table-data="filteredRegistrations"
            :total="filteredRegistrations.length"
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
                <el-table-column prop="contact_person" label="緊急連絡人" min-width="150" align="center" />
                <el-table-column prop="contact_phone" label="緊急連絡人電話" min-width="180" align="center" />
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