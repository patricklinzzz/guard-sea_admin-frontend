<script setup>
    import { ref, reactive, computed, onMounted, watch } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { Plus, Close } from '@element-plus/icons-vue'
    import CKEditorComponent from '@/components/ckeditor.vue'
    import { useProductStore } from '@/stores/product_store.js' 

    const route = useRoute()
    const router = useRouter()
    const productStore = useProductStore()

    const isEditMode = computed(() => !!route.params.id)
    const pageTitle = computed(() => (isEditMode.value ? '編輯活動' : '新增活動'))

    const isSubmitting = ref(false)

    const isFormLoading = computed(() => productStore.isFormLoading)
    const formError = computed(() => productStore.formError)

    const getInitialForm = () => ({
        id: null,
        eventName: '',
        eventDate: null,
        registrationDeadline: null,
        eventLocation: '',
        eventAddress: '',
        mainImageUrl: '',
        description: '',
        notes: '',
        eventCategory: '',
        quota: 0,
    })
    const form = reactive(getInitialForm())

    const uploadRef = ref(null)

    const triggerUpload = () => {
        uploadRef.value.$el.querySelector('input').click()
    }

    const handleFileChange = (uploadFile) => {
        form.mainImageUrl = URL.createObjectURL(uploadFile.raw)
    }

    const removeMainImage = () => {
        form.mainImageUrl = ''
        uploadRef.value.clearFiles()
    }

    const editorConfig = { height: '500px' }

    // 監聽並載入編輯模式下的活動資料
    watch(
        () => productStore.currentProduct.data,
        (newActivityData) => {
        if (newActivityData) {
            Object.assign(form, JSON.parse(JSON.stringify(newActivityData)))
        } else {
            Object.assign(form, getInitialForm())
        }
        },
        { deep: true }
    )

    onMounted(() => {
        if (isEditMode.value) {
        const activityId = Number(route.params.id)
        productStore.fetchProductForEdit(activityId) // 這裡邏輯上應為 fetchActivityForEdit
        } else {
        productStore.clearCurrentProduct() // 這裡邏輯上應為 clearCurrentActivity
        }
    })

    const handleSubmit = async () => {
        if (isSubmitting.value) return
        isSubmitting.value = true

        try {
        if (isEditMode.value) {
            await productStore.updateProduct(form) // 這裡邏輯上應為 updateActivity
        } else {
            await productStore.addProduct(form) // 這裡邏輯上應為 addActivity
        }
        alert('儲存成功！')
        router.push({ name: 'eventlist' })
        } catch (error) {
        console.error('儲存失敗:', error)
        alert('儲存失敗，請查看 Console。')
        } finally {
        isSubmitting.value = false
        }
    }

    const handleCancel = () => {
        router.back()
    }
</script>

<template>
    <div class="page-container">
        <header class="page-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        </header>

        <div v-if="isFormLoading" class="loading-text"> 載入中...</div>
        <div v-else-if="formError" class="error-text"> {{ formError }}</div>

        <el-form v-else :model="form" label-position="top">
        <el-form-item label="活動名稱">
            <el-input v-model="form.eventName" />
        </el-form-item>

        <div class="form-row">
            <el-form-item label="活動日期" class="date-picker-item">
            <el-date-picker
                v-model="form.eventDate"
                type="datetime"
                placeholder="選擇開始與結束日期時間"
                range-separator="至"
                start-placeholder="開始日期"
                end-placeholder="結束日期"
                format="YYYY/MM/DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
            />
            </el-form-item>
            <el-form-item label="報名截止" class="date-picker-item">
            <el-date-picker
                v-model="form.registrationDeadline"
                type="datetime"
                placeholder="選擇報名截止日期時間"
                format="YYYY/MM/DD HH:mm"
                value-format="YYYY-MM-DD HH:mm"
            />
            </el-form-item>
        </div>

        <div class="form-row">
            <el-form-item label="活動地點(顯示在列表)">
            <el-select v-model="form.eventLocation" placeholder="--選擇地區--">
                <el-option label="台北市" value="台北市" />
                <el-option label="新北市" value="新北市" />
                <el-option label="基隆市" value="基隆市" />
                <el-option label="桃園市" value="桃園市" />
                <el-option label="宜蘭市" value="宜蘭市" />
                <el-option label="花蓮市" value="花蓮市" />
                <el-option label="台東市" value="台東市" />
            </el-select>
            </el-form-item>
            <el-form-item label="地址">
            <el-input v-model="form.eventAddress" />
            </el-form-item>
        </div>

        <el-form-item label="活動大圖">
            <div class="custom-uploader-container">
            <el-upload
                ref="uploadRef"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleFileChange"
                accept="image/*"
                style="display: none"
            />
            <div class="uploader-trigger" @click="triggerUpload">
                <el-icon><Plus /></el-icon>
                <span>上傳檔案</span>
            </div>

            <div v-if="form.mainImageUrl" class="preview-item">
                <el-image :src="form.mainImageUrl" fit="cover" class="preview-image" />
                <button class="remove-btn" @click="removeMainImage">
                <el-icon><Close /></el-icon>
                </button>
            </div>
            </div>
        </el-form-item>

        <el-form-item label="活動內容">
            <CKEditorComponent v-model="form.description" :config="editorConfig" />
        </el-form-item>

        <el-form-item label="備註">
            <el-input v-model="form.notes" />
        </el-form-item>

        <div class="form-row">
            <el-form-item label="活動分類">
            <el-select v-model="form.eventCategory" placeholder="-選擇分類-">
                <el-option label="戶外活動" value="戶外活動" />
                <el-option label="室內講座" value="室內講座" />
                <el-option label="親子體驗" value="親子體驗" />
            </el-select>
            </el-form-item>
            <el-form-item label="名額">
            <el-input-number v-model="form.quota" :min="0" controls-position="right" />
            </el-form-item>
        </div>

        <el-form-item class="form-actions">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="isSubmitting">
            {{ isEditMode ? '儲存' : '新增' }}
            </el-button>
        </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
    .page-container {
        padding: 2rem;
        max-width: 800px;
        margin: auto;
    }
    .page-header {
        margin-bottom: 1.5rem;
    }
    .page-title {
        font-size: 24px;
        font-weight: bold;
    }

    // 新增一個 .form-row 來處理兩欄佈局
    .form-row {
        display: flex;
        gap: 20px;
        .el-form-item {
        flex: 1;
        }
    }

    // 圖片上傳區域的樣式
    .custom-uploader-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    .uploader-trigger {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #fafafa;
        transition: border-color 0.2s;
        &:hover {
        border-color: #409eff;
        }
        .el-icon {
        font-size: 28px;
        color: #8c939d;
        }
        span {
        font-size: 12px;
        color: #606266;
        }
    }

    .preview-item {
        width: 100px;
        position: relative;
        .preview-image {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        display: block;
        }
        .remove-btn {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #f56c6c;
        color: white;
        border: none;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0.8;
        &:hover {
            opacity: 1;
        }
        }
    }

    .form-actions {
        margin-top: 30px;
        display: flex;
        justify-content: flex-end;
    }
</style>