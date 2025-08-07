<script setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Plus, Close, Check } from '@element-plus/icons-vue'
  import CKEditorComponent from '@/components/ckeditor.vue'
  import { useProductStore } from '@/stores/product_store.js'

  const route = useRoute()
  const router = useRouter()
  const productStore = useProductStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯商品' : '新增商品'))

  const isSubmitting = ref(false)

  const isFormLoading = computed(() => productStore.isFormLoading)
  const formError = computed(() => productStore.formError)

  const getInitialForm = () => ({
    id: null,
    sku: '',
    name: '',
    description: '',
    price: 0,
    mainImageUrl: '',
    category: '',
    status: '上架',
    styles: [],
    sizes: [],
  })
  const form = reactive(getInitialForm())

  const uploadRef = ref(null)

  const triggerUpload = () => {
    uploadRef.value.$el.querySelector('input').click()
  }

  const handleFileChange = (uploadFile) => {
    const newStyle = {
      uid: uploadFile.uid,
      colorName: '',
      colorCode: '#409EFF',
      imageUrl: URL.createObjectURL(uploadFile.raw),
      fileName: uploadFile.name,
      rawFile: uploadFile,
    }
    form.styles.push(newStyle)
  }

  const removeStyle = (index) => {
    const styleToRemove = form.styles[index]
    if (styleToRemove) {
      if (styleToRemove.rawFile) {
        uploadRef.value.handleRemove(styleToRemove.rawFile)
      }
      form.styles.splice(index, 1)
    }
  }

  const setAsMainImage = (style) => {
    form.mainImageUrl = style.imageUrl
  }

  const editorConfig = { height: '500px' }

  watch(
    () => form.category,
    async (newCategory) => {
      if (newCategory && !isEditMode.value) {
        form.sku = '生成中...' 
        try {
          const newSku = await productStore.generateNextSku(newCategory)
          form.sku = newSku
        } catch (error) {
          console.error('無法生成商品編號:', error)
          form.sku = '生成失敗，請稍後重試'
        }
      }
    }
  )
  watch(
    () => productStore.currentProduct.data,
    (newProductData) => {
      if (newProductData) {
        Object.assign(form, JSON.parse(JSON.stringify(newProductData)))
      } else {
        Object.assign(form, getInitialForm())
      }
    },
    { deep: true }
  )

  onMounted(() => {
    if (isEditMode.value) {
      const productId = Number(route.params.id)
      productStore.fetchProductForEdit(productId)
    } else {
      productStore.clearCurrentProduct()
    }
  })

  const handleSubmit = async () => {
    if (isSubmitting.value) return
    isSubmitting.value = true

    if (!form.mainImageUrl && form.styles.length > 0) {
      form.mainImageUrl = form.styles[0].imageUrl
    }

    try {
      if (isEditMode.value) {
        await productStore.updateProduct(form)
      } else {
        await productStore.addProduct(form)
      }
      alert('儲存成功！')
      router.push({ name: 'productlist' })
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

    <div v-if="isFormLoading" class="loading-text">⏳ 載入中...</div>
    <div v-else-if="formError" class="error-text">❌ {{ formError }}</div>

    <el-form v-else :model="form" label-position="top">
      <el-form-item label="商品編號">
        <el-input v-model="form.sku" :disabled="true" placeholder="選擇分類後自動生成" />
      </el-form-item>
      <el-form-item label="商品分類">
        <el-select v-model="form.category" placeholder="-選擇類型-">
          <el-option label="機能服飾" value="機能服飾" />
          <el-option label="各類包款" value="各類包款" />
          <el-option label="周邊小物" value="周邊小物" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名稱"><el-input v-model="form.name" /></el-form-item>

      <el-form-item label="商品圖片">
        <div class="custom-uploader-container">
          <el-upload
            ref="uploadRef"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            multiple
            accept="image/*"
            style="display: none"
          />
          <div class="uploader-trigger" @click="triggerUpload">
            <el-icon><Plus /></el-icon>
            <span>上傳檔案</span>
          </div>
          <div v-for="(style, index) in form.styles" :key="style.uid" class="preview-item">
            <el-image :src="style.imageUrl" fit="cover" class="preview-image" />
            <span class="preview-filename" :title="style.fileName">{{ style.fileName }}</span>
            <button class="remove-btn" @click="removeStyle(index)">
              <el-icon><Close /></el-icon>
            </button>
          </div>
        </div>
        <div class="styles-details-container" v-if="form.styles.length > 0">
          <div
            v-for="style in form.styles"
            :key="style.uid"
            class="style-detail-item"
            :class="{ 'is-main': style.imageUrl === form.mainImageUrl && style.imageUrl }"
          >
            <el-image :src="style.imageUrl" fit="cover" class="detail-thumbnail" />
            <div class="color-inputs">
              <el-input
                v-model="style.colorCode"
                placeholder="顏色代碼"
                size="small"
                :disabled="true"
              />
              <el-color-picker v-model="style.colorCode" size="small" />
            </div>
            <el-button
              v-if="style.imageUrl"
              :disabled="style.imageUrl === form.mainImageUrl"
              size="small"
              class="set-main-btn"
              @click="setAsMainImage(style)"
              :icon="Check"
            >
              設為主圖
            </el-button>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="商品價格">
        <el-input-number v-model="form.price" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="商品狀態">
        <el-switch
          v-model="form.status"
          size="large"
          active-text="上架"
          inactive-text="下架"
          active-value="上架"
          inactive-value="下架"
        />
      </el-form-item>
      <el-form-item label="可用尺寸">
        <el-select
          v-model="form.sizes"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="輸入尺寸後按 Enter 新增"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="商品內容">
        <CKEditorComponent v-model="form.description" :config="editorConfig" />
      </el-form-item>

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
    .preview-filename {
      font-size: 12px;
      color: #606266;
      display: block;
      text-align: center;
      margin-top: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

  .styles-details-container {
    border-top: 1px solid #e4e7ed;
    margin-top: 1rem;
    padding-top: 1rem;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .style-detail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: 2px solid #dcdfe6;
    border-radius: 4px;
    transition: border-color 0.2s;
    &.is-main {
      border-color: #409eff;
    }
  }
  .detail-thumbnail {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
  .set-main-btn {
    margin-top: 0.5rem;
  }

  .color-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .form-actions {
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  }
</style>
