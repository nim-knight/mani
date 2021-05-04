<template>
  <div class="FileEditor">
    <div class="body">
      <CodeEditor
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TabInfo from '@/components/application-editor/object-editor-tabs/TabInfo';
import FileEditableObject from '@/core/editable-object/file-editable-object/FileEditableObject';
import CodeEditor from '@/components/common/code-editor/CodeEditor.vue'

@Component({
  components: { CodeEditor }
})
export default class FileEditor extends Vue {
  @Prop({ required: true })
  protected tabInfo!: TabInfo;

  private get fileEditableObject() {
    return this.tabInfo.object as FileEditableObject
  }

  public get file() {
    return this.fileEditableObject.file
  }

  public get content() {
    return this.file.content
  }

  public set content(content: string) {
    this.file.content = content
  }

  public get tabInfoKey() {
    const tabInfo = this.tabInfo
    return `${tabInfo.editor.name}:${tabInfo.object.id}`
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.FileEditor {
  font-size: 12px;
  height: 100%;
  padding: 2px;
  .body {
    height: calc(100% - 4px);
    background: $panel-background-color-darken;
  }
  .code-editor {
    height: 100%;
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-color-darken;
  }
}
</style>
