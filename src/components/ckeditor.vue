<template>
  <div class="main-container">
    <div class="editor-container editor-container_classic-editor" ref="editorContainerElement">
      <div class="editor-container__editor">
        <div ref="editorElement">
          <ckeditor
            v-if="editor && editorConfig"
            :model-value="initialLoadContent"
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
  } from 'ckeditor5'

  import translations from 'ckeditor5/translations/zh.js'
  import 'ckeditor5/ckeditor5.css'

  /**
   * Create a free account with a trial: https://portal.ckeditor.com/checkout?plan=free
   */
  const initialLoadContent = ref('')
  let ckeditorInstance = null
  const onEditorReady = (currentEditorInstance) => {
    ckeditorInstance = currentEditorInstance
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
      ],
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
