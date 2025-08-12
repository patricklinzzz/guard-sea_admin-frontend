<template>
  <div class="main-container">
    <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
      <div class="editor-container__editor">
        <div ref="editorElement">
          <ckeditor
            v-if="editor && editorConfig"
            :model-value="props.modelValue"
            :editor="editor"
            :config="editorConfig"
            @ready="onEditorReady"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
   * https://ckeditor.com/ckeditor-5/builder/#installation/NoNgNARATAdA7DADBSAWAzOxAOKBWbVATjwEZSoQR0RFKd0odEjE45MpTVUUIAvABYpEYYKTCjRE6QF1IAUxCkQAEwBGICLKA===
   */

  import { computed, ref, onMounted } from 'vue'
  import { Ckeditor } from '@ckeditor/ckeditor5-vue'

  import {
    ClassicEditor,
    Autoformat,
    AutoImage,
    Autosave,
    BlockQuote,
    Bold,
    Emoji,
    Essentials,
    Heading,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    TextTransformation,
    TodoList,
    Underline,
    CodeBlock,
    SimpleUploadAdapter,
  } from 'ckeditor5'

  import translations from 'ckeditor5/translations/zh.js'
  import 'ckeditor5/ckeditor5.css'

  /**
   * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
   */
  // const initialLoadContent = ref('')

  //新增接收內容的屬性定義start
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
  })

  const emit = defineEmits(['update:modelValue'])

  //新增接收內容的屬性定義end

  let ckeditorInstance = null
  const onEditorReady = (currentEditorInstance) => {
    ckeditorInstance = currentEditorInstance

    // 監聽編輯器內容的 'change:data' 事件start
    ckeditorInstance.model.document.on('change:data', () => {
      // 獲取編輯器當前的 HTML 內容
      const data = ckeditorInstance.getData()
      // 透過 emit 發出 update:modelValue 事件，並將新內容作為參數傳出去
      emit('update:modelValue', data)
    })
    // 監聽編輯器內容的 'change:data' 事件end
  }

  const LICENSE_KEY = 'GPL' // or <YOUR_LICENSE_KEY>.
  const isLayoutReady = ref(false)
  const editor = ClassicEditor

  const editorConfig = computed(() => {
    if (!isLayoutReady.value) {
      return null
    }

    return {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'emoji',
          'link',
          'ImageUpload',
          'insertTable',
          'blockQuote',
          'codeBlock',
          '|',
          'bulletedList',
          'numberedList',
          'todoList',
          'outdent',
          'indent',
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Autoformat,
        AutoImage,
        Autosave,
        BlockQuote,
        Bold,
        Emoji,
        Essentials,
        Heading,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        Paragraph,
        PasteFromOffice,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextTransformation,
        TodoList,
        Underline,
        CodeBlock,
        SimpleUploadAdapter,
      ],

      simpleUpload: {
        // 這裡填寫您後端用來處理圖片上傳的 PHP 檔案的完整 URL
        uploadUrl: 'http://localhost:8888/guard-sea-api/upload_image.php',
        // 您也可以在這裡設定 headers，例如傳遞 token
        // headers: {
        //   'Authorization': 'Bearer <YOUR_TOKEN>'
        // }
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
        ],
      },
      image: {
        toolbar: [
          'toggleImageCaption',
          'imageTextAlternative',
          '|',
          'imageStyle:inline',
          'imageStyle:wrapText',
          'imageStyle:breakText',
          '|',
          'resizeImage',
        ],
      },
      language: 'zh',
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file',
            },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      mention: {
        feeds: [
          {
            marker: '@',
            feed: [
              /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
            ],
          },
        ],
      },
      placeholder: '輸入文字',
      table: {
        contentToolbar: [
          'tableColumn',
          'tableRow',
          'mergeTableCells',
          'tableProperties',
          'tableCellProperties',
        ],
      },
      translations: [translations],
    }
  })

  onMounted(() => {
    isLayoutReady.value = true
  })

  // 讓父元件能透過 v-model 和 ref 訪問 editorContent
  // defineExpose({
  //   editorContent,
  // })
</script>
