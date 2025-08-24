<script setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { Plus, Close, Check } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import CKEditorComponent from '@/components/ckeditor.vue'
  import { useProductStore } from '@/stores/product_store.js'
  import { useProductCategoryStore } from '@/stores/product_category_store.js'

  const route = useRoute()
  const router = useRouter()
  const productStore = useProductStore()
  const categoryStore = useProductCategoryStore()

  const isEditMode = computed(() => !!route.params.id)
  const pageTitle = computed(() => (isEditMode.value ? '編輯商品' : '新增商品'))

  const isSubmitting = ref(false)
  const isFormLoading = computed(() => productStore.isFormLoading)
  const formError = computed(() => productStore.formError)
  const isUploading = ref(false)
  const isGeneratingSku = ref(false)

  const getInitialForm = () => ({
    product_id: null,
    sku: '',
    name: '',
    description: '',
    content: '',
    price: 0,
    main_image_url: '',
    size: [],
    colors: [],
    category_id: null,
    status: '上架',
    styles: [],
  })
  const form = reactive(getInitialForm())

  const uploadRef = ref(null)

  const triggerUpload = () => {
    uploadRef.value.$el.querySelector('input').click()
  }

  const handleFileChange = (uploadFile) => {
    if (!uploadFile.raw) {
      return
    }
    const newStyle = {
      uid: uploadFile.uid,
      colorName: '',
      imageUrl: URL.createObjectURL(uploadFile.raw),
      fileName: uploadFile.name,
      rawFile: uploadFile.raw,
      isNew: true,
    }
    form.styles.push(newStyle)
    ElMessage.success('圖片已選取！')
    if (form.styles.length === 1) {
      setAsMainImage(newStyle)
    }
  }

  const removeStyle = async (index) => {
    const styleToRemove = form.styles[index]
    if (styleToRemove) {
      try {
        await ElMessageBox.confirm('確定要移除這張圖片嗎？', '警告', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        form.styles.splice(index, 1)
        if (form.main_image_url === styleToRemove.imageUrl) {
          form.main_image_url = ''
        }
        ElMessage.success('圖片已移除！')
      } catch (e) {
        if (e === 'cancel') {
          return
        }
        console.error('移除圖片失敗:', e)
        ElMessage.error('移除圖片失敗，請稍後再試。')
      }
    }
  }

  const setAsMainImage = (style) => {
    form.main_image_url = style.imageUrl
  }

  const editorConfig = { height: '500px' }

  watch(
    () => form.category_id,
    async (newCategoryId) => {
      if (newCategoryId && !isEditMode.value) {
        isGeneratingSku.value = true
        form.sku = '生成中...'
        try {
          const newCategory = categoryStore.categories.find(
            (c) => Number(c.category_id) === newCategoryId
          )?.category_name
          if (newCategory) {
            const newSku = await productStore.generateNextSku(newCategory)
            form.sku = newSku
          }
        } catch (error) {
          console.error('無法生成商品編號:', error)
          form.sku = '生成失敗，請稍後重試'
        } finally {
          isGeneratingSku.value = false
        }
      }
    }
  )

  watch(
    () => productStore.currentProduct.data,
    (newProductData) => {
      if (newProductData) {
        const sizeArray = newProductData.size ? String(newProductData.size).split(',') : []
        const colorsArray = newProductData.color_code
          ? String(newProductData.color_code).split(',')
          : []
        const backendBaseUrl = 'http://localhost:8888/guard-sea_api'

        const imageUrls = [
          newProductData.main_image_url,
          newProductData.sub_image_1,
          newProductData.sub_image_2,
          newProductData.sub_image_3,
        ].filter((url) => url && url.length > 0)

        const stylesFromBackend = [...new Set(imageUrls)].map((url, index) => ({
          uid: `backend-${index}-${Date.now()}`,
          imageUrl: `${backendBaseUrl}${url}`,
          fileName: url.substring(url.lastIndexOf('/') + 1),
          isNew: false,
          backendPath: url,
        }))

        Object.assign(form, {
          ...newProductData,
          price: Number(newProductData.price),
          category_id: Number(newProductData.category_id),
          status: Number(newProductData.status) === 1 ? '上架' : '下架',
          size: sizeArray,
          styles: stylesFromBackend,
          colors: colorsArray,
        })
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
    productStore.fetchProducts()
    categoryStore.fetchCategories()
  })
  const addColor = () => {
    form.colors.push('#FFFFFF')
  }

  const removeColor = (index) => {
    form.colors.splice(index, 1)
  }

  const handleSubmit = async () => {
    if (isSubmitting.value || isGeneratingSku.value) return
    isSubmitting.value = true

    const formData = new FormData()

    formData.append('product_id', form.product_id || '')
    formData.append('sku', form.sku || '')
    formData.append('name', form.name || '')
    formData.append('price', String(form.price) || '0')
    formData.append('description', form.description || '')
    formData.append('content', form.content || '')
    formData.append('category_id', String(form.category_id) || '')
    formData.append('status', String(form.status === '上架' ? 1 : 0) || '0')
    formData.append('size', form.size && form.size.length > 0 ? form.size.join(',') : '')
    formData.append('color_code', form.colors.length > 0 ? form.colors.join(',') : '') // 關鍵修正：將顏色陣列轉換為字串

    const newFiles = form.styles.filter((s) => s.isNew)
    const existingImages = form.styles.filter((s) => !s.isNew)
    const mainImage =
      newFiles.find((s) => s.imageUrl === form.main_image_url) ||
      existingImages.find((s) => s.imageUrl === form.main_image_url)

    if (mainImage?.isNew) {
      formData.append('main_image_file', mainImage.rawFile)
    } else if (mainImage?.backendPath) {
      formData.append('main_image_url', mainImage.backendPath)
    } else {
      formData.append('main_image_url', '')
    }

    const subImages = form.styles.filter((s) => s !== mainImage)
    subImages.forEach((sub, index) => {
      if (sub.isNew) {
        formData.append(`sub_image_${index + 1}_file`, sub.rawFile)
      } else if (sub.backendPath) {
        formData.append(`sub_image_${index + 1}_url`, sub.backendPath)
      } else {
        formData.append(`sub_image_${index + 1}_url`, '')
      }
    })

    try {
      if (isEditMode.value) {
        formData.append('_method', 'PUT')
        await productStore.updateProduct(formData)
      } else {
        await productStore.addProduct(formData)
      }
      ElMessage.success('儲存成功！')
      router.push({ name: 'productlist' })
    } catch (error) {
      console.error('儲存失敗:', error)
      ElMessage.error(error.message || '儲存失敗，請查看 Console。')
    } finally {
      isSubmitting.value = false
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const categoryOptions = computed(() => {
    return categoryStore.categories.map((cat) => ({
      label: cat.category_name,
      value: Number(cat.category_id),
    }))
  })
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
        <el-select v-model="form.category_id" placeholder="-選擇類型-" style="width: 100%">
          <el-option
            v-for="cat in categoryOptions"
            :key="cat.value"
            :label="cat.label"
            :value="cat.value"
          />
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
            <span>{{ isUploading ? '上傳中...' : '上傳檔案' }}</span>
          </div>
          <div v-for="(style, index) in form.styles" :key="style.uid" class="preview-item">
            <el-image :src="style.imageUrl" fit="cover" class="preview-image" />
            <span class="preview-filename" :title="style.fileName">{{ style.fileName }}</span>
            <button class="remove-btn" @click.prevent="removeStyle(index)">
              <el-icon><Close /></el-icon>
            </button>
          </div>
        </div>
        <div class="styles-details-container" v-if="form.styles.length > 0">
          <div
            v-for="(style, index) in form.styles"
            :key="style.uid"
            class="style-detail-item"
            :class="{ 'is-main': style.imageUrl === form.main_image_url && style.imageUrl }"
          >
            <el-image :src="style.imageUrl" fit="cover" class="detail-thumbnail" />
            <div class="color-inputs">
              <el-input v-model="form.colors[index]" placeholder="顏色代碼" size="small" />
              <el-color-picker v-model="form.colors[index]" size="small" />
            </div>
            <el-button
              v-if="style.imageUrl"
              :disabled="style.imageUrl === form.main_image_url"
              size="small"
              class="set-main-btn"
              @click.prevent="setAsMainImage(style)"
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
          v-model="form.size"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="輸入尺寸後按 Enter 新增"
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="商品內容">
        <CKEditorComponent v-model="form.content" :config="editorConfig" />
      </el-form-item>
      <el-form-item class="form-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="isSubmitting"
          :disabled="isGeneratingSku || isSubmitting"
        >
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
