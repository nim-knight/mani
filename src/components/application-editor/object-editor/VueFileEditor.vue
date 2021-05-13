<template>
  <div class="VueFileEditor">
    <div class="body">
      <AxisSpace class="axis-space">
        <PagePreviewer v-if="pageConfig" :pageConfig="pageConfig"></PagePreviewer>
      </AxisSpace>
      <div class="code-tool-bar">
        <font-awesome-icon
          class="icon"
          :icon="['fas', 'chevron-circle-right']"
        />
        <span class="name">代码编辑器</span>
      </div>
      <CodeEditor
        class="code-editor"
        ref="codeEditor"
        v-model="content"
      ></CodeEditor>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Inject, Prop, Vue } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import TabInfo from '@/components/application-editor/object-editor-tabs/TabInfo';
import FileEditableObject from '@/core/editable-object/file-editable-object/FileEditableObject';
import CodeEditor from '@/components/common/code-editor/CodeEditor.vue'
import AxisSpace from '@/components/common/axis-space/AxisSpace.vue'
import PagePreviewer from '@/components/common/previewer/PagePreviewer.vue'
import ApplicationEditor from '../ApplicationEditor.vue';

@Component({
  components: {
    AxisSpace,
    CodeEditor,
    FontAwesomeIcon,
    PagePreviewer
  }
})
export default class VueFileEditor extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  @Prop({ required: true })
  protected tabInfo!: TabInfo;

  private get fileEditableObject() {
    return this.tabInfo.object as FileEditableObject
  }

  public get file() {
    return this.fileEditableObject.file
  }

  private get pageConfig() {
    return this.fileEditableObject.fileHandler.pageConfig
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
.VueFileEditor {
  font-size: 12px;
  height: 100%;
  padding: 2px;
  .body {
    height: calc(100% - 4px);
    background: $panel-background-color-darken;
  }

  .code-tool-bar {
    height: 32px;
    line-height: 32px;
    background: $panel-background-color;
  }
  .code-tool-bar .icon {
    color: #ff6600;
    width: 24px;
    height: 14px;
    vertical-align: text-bottom;
    cursor: pointer;
  }
  .code-tool-bar .icon:hover {
    color: white;
  }

  .code-tool-bar .name {
    margin-left: 4px;
  }

  .axis-space,
  .code-editor {
    height: calc(50% - 16px);
  }
  ::v-deep .CodeMirror,
  ::v-deep .CodeMirror-gutters {
    background: $panel-background-color-darken;
  }
}
</style>
