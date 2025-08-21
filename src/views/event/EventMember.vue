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
    const eventId = route.params.id
    if (eventId) {
        registrationStore.fetchRegistrationByEvent(eventId)
    }
})

// 根據 searchTerm 過濾報名名單，改為以 phone 欄位進行搜尋
const filteredRegistrations = computed(() => {
    if (!searchTerm.value) return registrationStore.registrationList
    return registrationStore.registrationList.filter((a) =>
        a.phone.toLowerCase().includes(searchTerm.value.toLowerCase())
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
            search-placeholder="請輸入電話"
            @search="performSearch"
        >
            <template #default="{ data }">
            <el-table :data="data" style="width: 100%" class="activity_list_table">
                <el-table-column prop="activity_registration_id" label="編號" min-width="80" align="center" />
                <el-table-column prop="phone" label="電話" min-width="180" align="center" />
                <el-table-column prop="contact_person" label="緊急連絡人" min-width="150" align="center" />
                <el-table-column prop="contact_phone" label="緊急連絡人電話" min-width="180" align="center" />
                <el-table-column prop="notes" label="備註" min-width="300" />
                <el-table-column prop="registration_date" label="報名日期" min-width="180" align="center" />
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