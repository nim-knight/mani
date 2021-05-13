<template>
  <div class="FileEditor">
    <div class="body">
      <img :src="base64Url"/>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TabInfo from '@/components/application-editor/object-editor-tabs/TabInfo';
import FileEditableObject from '@/core/editable-object/file-editable-object/FileEditableObject';

@Component({
  components: { }
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

  public get base64() {
    return this.file.base64
  }
  
  public get base64Url() {
    return 'data:image/png;base64,' + this.base64
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
    height: 100%;
    line-height: calc(100%);
    background: $panel-background-color-darken;
    display: flex;
    align-items:center;
    justify-content:center;
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
