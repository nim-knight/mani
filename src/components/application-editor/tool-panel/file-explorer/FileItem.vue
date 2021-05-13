<template>
  <div
    class="FileItem"
    :class="{ 'is-selected': isSelected }"
    @click="handleClick"
    @dblclick="handleDbClick"
    @contextmenu.stop.prevent="handleContextmenu"
  >
    <font-awesome-icon
      class="object-type-icon"
      :icon="icon"
      :style="{
        color: iconColor,
      }"
    />
      <NameEditor
        class="name"
        ref="nameEditor"
        v-model="file.name"
      ></NameEditor>
    <div class="background"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Ref } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { MessageBox } from 'element-ui'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'
import NameEditor from './NameEditor.vue'
import File from '@/core/file-model/File'
import DirectoryItem from './DirectoryItem.vue'
import Directory from '@/core/file-model/Directory'
import { getEditableObjectTypeInfo } from '@/components/common/util/editableObjectUtil'

@Component({
  components: {
    FontAwesomeIcon,
    NameEditor
  }
})
export default class FileItem extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  @Ref()
  private nameEditor!: NameEditor

  @Prop()
  private file!: File

  @Prop()
  private selected!: (Directory|File)[]

  public get isSelected () {
    return this.selected.indexOf(this.file) !== -1
  }

  public get siblings() {
    if (this.$parent instanceof DirectoryItem) {
      const directorys = this.$parent.directory.directorys
      const files = this.$parent.directory.files

      return [...directorys, ...files.filter(d => d !== this.file)]
    }
    return []
  }

  private get fileEditableObject() {
    return this.appEditor.fileEditableObjectMap.get(this.file)
  }

  private get info() {
    if (this.fileEditableObject) {
      return getEditableObjectTypeInfo(this.fileEditableObject)
    }
    return null
  }

  private get icon() {
    return this.info?.icon || ['far', 'file']
  }

  private get iconColor() {
    return this.info?.color || '#cd853f'
  }

  private handleContextmenu(event: MouseEvent) {
    const meunItems = [{
        name: '打开',
        handler: () => { /*  */}
      }, {
        name: '复制路径',
        handler: () => { /*  */}
      }, {
        name: 'split-line'
      }, {
        name: '重命名',
        handler: () => {
          this.nameEditor.startInput()
        }
      }, {
        name: '删除',
        handler: async () => {
          try {
            await MessageBox.confirm(`是否删除文件夹 ${this.file.name} ！`, '警告')
            this.remove()
          } catch (error) {/*  */}
        }
      }
    ]

    this.appEditor.openContextmenu(event, meunItems)
  }

  private handleClick() {
    if (this.fileEditableObject) {
      this.appEditor.openObjectEditor(this.fileEditableObject, null, true)
    }
  }

  private handleDbClick() {
    if (this.fileEditableObject) {
      this.appEditor.openObjectEditor(this.fileEditableObject)
    }
  }

  private remove() {
    const parent = this.$parent as DirectoryItem
    const directorys = parent.directory.files
    const index = directorys.indexOf(this.file)
    if (index >= 0) {
      directorys.splice(index, 1);
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.FileItem {
  position: relative;
  height: 26px;
  line-height: 26px;
  color: #babaca;
  cursor: pointer;
  .object-type-icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 10px;
    height: 16px;
    margin-left: 17px;
    margin-right: 11px;
    margin-top: 5px;
    margin-right: 8px;
    vertical-align: super;
  }
  .name {
    position: relative;
    display: inline-block;
    width: calc(100% - 40px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;
    color: $text-color;
    z-index: 1;
    vertical-align: top;
  }
  .background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1000px;
    right: -6px;
  }
  &:hover .background {
    background: rgba(0,0,0,0.25);
    z-index: 0;
  }
  &.is-selected .background {
    background: red;
  }
}
</style>
