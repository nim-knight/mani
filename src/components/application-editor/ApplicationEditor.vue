<template>
  <div class="ApplicationEditor" @wheel.ctrl.prevent.stop @contextmenu.prevent>
    <ApplicationEditorHeader></ApplicationEditorHeader>
    <div class="body">
      <!-- <ApplicationEditorSidebar class="sidebar"></ApplicationEditorSidebar> -->
      <div class="main-view">
        <DragLayoutContext :layoutNode="layoutRootNode">
          <ObjectEditorTabs
            name="main"
            ref="objectEditorTabs"
            @change="handelObjectEditorTabsChange"
          ></ObjectEditorTabs>
          <FileExplorer name="test-1"/>
          <div name="test-2">test-2</div>
          <PropertiesConfigPanel name="test-3"/>
          <div name="test-4">test-4</div>
          <div name="test-5">test-5</div>
        </DragLayoutContext>
      </div>
    </div>
    <ApplicationEditorMenu ref="menu"></ApplicationEditorMenu>
  </div>
</template>
<script lang="ts">
import { VueConstructor } from 'vue/types/vue'
import { Component, Provide, Ref, Vue, Watch } from 'vue-property-decorator'
import { LayoutNode } from '@/components/common/drag-layout/DragLayoutInterface'
import { JsonConvert } from '@/core/json2typescript/json-convert'
import EditableObject from '@/core/editable-object/EditableObject'
import defaultLayout from './default-layout'

import ApplicationEditorHeader from './ApplicationEditorHeader.vue'
import DragLayoutContext from '@/components/common/drag-layout/DragLayoutContext.vue'
import ObjectEditorTabs from './object-editor-tabs/ObjectEditorTabs.vue'
import FileExplorer from './tool-panel/file-explorer/FileExplorer.vue'
import PropertiesConfigPanel from './tool-panel/properties-config-panel/PropertiesConfigPanel.vue'
import { default as ApplicationEditorMenu, MeunItem} from './ApplicationEditorMenu.vue'

import Project from '@/core/model/Project'
import Directory from '@/core/model/Directory'
import File from '@/core/model/File'

import localforage from 'localforage'
import throttle from 'lodash.throttle'

@Component({
  name: 'ApplicationEditor',
  components: {
    ApplicationEditorHeader,
    DragLayoutContext,
    ObjectEditorTabs,
    PropertiesConfigPanel,
    FileExplorer,
    ApplicationEditorMenu
  }
})
export default class ApplicationEditor extends Vue {
  @Ref()
  public objectEditorTabs!: ObjectEditorTabs

  @Ref()
  public menu!: ApplicationEditorMenu

  @Provide('app-editor')
  public get appEditor (): ApplicationEditor { return this }

  public project: Project = new Project()

  /** 当前激活的对象编辑器的KEY */
  public currentEditableObject: EditableObject| null = null

  private layoutRootNode: LayoutNode = defaultLayout

  private get projectFiles() {
    const projectFiles: File[] = []
    const  traverse = (directory: Directory) => {
      if (directory) {
        for (const subDirectory of directory.directorys) {
          traverse(subDirectory)
        }
        for (const file of directory.files) {
          projectFiles.push(file)
        }
      }
    }
    if (this.project) {
      traverse(this.project.rootDirectory)
    }
    return projectFiles
  }

  public openObjectEditor(
    object: EditableObject,
    editor?: VueConstructor | undefined | null,
    isPreview = false
  ) {
    return this.objectEditorTabs.openObjectEditor(object, editor, isPreview)
  }

  public openProject(project: Project) {
    this.project = project
    localforage.setItem('mani-project', this.project)
  }

  public openContextmenu(event: MouseEvent, meunItems: MeunItem[]) {
    this.menu.openContextmenu(event.clientX, event.clientY, meunItems)
  }

  @Watch('project', { deep: true })
  private projectChange(project: Project) {
    this.saveChange(project)
  }

  private saveChange = throttle((project) => {
    this.project && localforage.setItem('mani-project', project)
  }, 100)

  /* 事件处理 */
  private handelObjectEditorTabsChange(object: EditableObject| null) {
    this.currentEditableObject = object
  }

  private async mounted () {
    const projectPlainObject = await localforage.getItem('mani-project')
    if (projectPlainObject) {
      this.project = new JsonConvert().deserializeObject(projectPlainObject, Project)
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';

$interval: 0px;

.ApplicationEditor {
  color: $text-color;
  font-size: 12px;
  background: $background-color;

  .body {
    display: flex;
    margin-top: 0px;
    width: 100%;
    height: calc(100% - #{$header-height + 1px});
    border-top: solid 1px $border-color;
    padding: $interval;
  }

  .sidebar {
    width: 175px;
    flex-shrink: 0;
    margin-right: $interval;
    border-right: solid 1px $border-color;
  }
 
  .main-view {
    flex-grow: 1;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
@import '~@/style/global.scss';
</style>
