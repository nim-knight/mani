<template>
  <div
    class="DirectoryItem"
    @contextmenu.stop.prevent="handleContextmenu"
  >
    <div class="directory"
      :class="{ expanded }"
      v-if="!root"
      @click="expanded = !expanded"
    >
      <font-awesome-icon
        class="arrow-icon"
        :icon="expanded ? ['fas', 'chevron-down'] : ['fas', 'chevron-right']"
      />
      <font-awesome-icon
        class="icon expanded"
        :icon="expanded ? ['fas', 'folder-open'] : ['fas', 'folder']"
      />
      <span class="name">{{directory.name}}</span>
    </div>
    <div :class="root ? '' : 'children'" v-if="expanded || root">
      <div class="new" v-if="newInfo.show && newInfo.type === 'directory'">
        <font-awesome-icon
          class="arrow-icon"
          :icon="['fas', 'chevron-right']"
        />
        <font-awesome-icon
          class="icon"
          :icon="['fas', 'folder']"
        />
        <input
          type="text"
          ref="newInput"
          v-model="newInfo.name"
          @blur="handleCreateNew"
          @keydown.esc="handleCreateNew"
          @keydown.enter="handleCreateNew"
        >
      </div>
      <DirectoryItem
        v-for="item in directorys"
        :directory="item"
        :key="item.name"
      ></DirectoryItem>
      <div class="new" v-if="newInfo.show && newInfo.type === 'file'">
        <font-awesome-icon
          class="file-icon"
          :icon="['far', 'file']"
        />
        <input
          type="text"
          ref="newInput"
          v-model="newInfo.name"
          @blur="handleCreateNew"
          @keydown.esc="handleCreateNew"
          @keydown.enter="handleCreateNew"
        >
      </div>
      <FileItem
        v-for="item in files"
        :file="item"
        :key="item.name"
      ></FileItem>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject, Ref } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'
import Directory from '@/core/model/Directory'
import File from '@/core/model/File'
import FileItem from './FileItem.vue'

@Component({
  name: 'DirectoryItem',
  components: {
    FontAwesomeIcon,
    FileItem
  }
})
export default class DirectoryItem extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  @Prop()
  private directory!: Directory

  private newInfo = {
    type: 'directory',
    show: false,
    name: ''
  }

  @Prop({
    required: false,
    default: false
  })
  private root!: boolean

  public expanded = false;

  private get directorys() {
    return this.directory.directorys
  }

  private get files() {
    return this.directory.files
  }

  private handleContextmenu(event: MouseEvent) {
    this.appEditor.openContextmenu(event, [
      {
        name: '新建文件',
        handler: () => { this.openNewInput('file') }
      }, {
        name: '新建文件夹',
        handler: () => { this.openNewInput('directory') }
      }, {
        name: 'split-line'
      }, {
        name: '文件夹内查找',
        handler: () => { /*  */}
      }, {
        name: '复制路径',
        handler: () => { /*  */}
      }, {
        name: 'split-line'
      }, {
        name: '重命名',
        handler: () => { /*  */}
      }, {
        name: '删除',
        handler: () => { /*  */}
      }
    ])
  }

  private openNewInput(type: string) {
    this.newInfo.type = type
    this.newInfo.show = true
    this.newInfo.name = ''
    this.$nextTick(() => {
      const newInput = this.$refs.newInput as HTMLInputElement
      newInput.focus()
    })
  }

  private handleCreateNew() {
    this.newInfo.show = false
    if (!this.newInfo.name) {
      return
    }
    if (this.newInfo.type === 'file') {
      const file = new File()
      file.name = this.newInfo.name
      this.directory.files.push(file)
    } else if (this.newInfo.type === 'directory') {
      const directory = new Directory()
      directory.name = this.newInfo.name
      this.directory.directorys.push(directory)
    }
    this.newInfo.name = ''
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
$folderColor: #90a4ae;

.DirectoryItem {
  .directory {
    position: relative;
    height: 26px;
    line-height: 26px;
    color: #babaca;
    cursor: pointer;
  }
  .arrow-icon {
    display: inline-block;
    position: relative;
    top: -3px;
    width: 10px;
    height: 10px;
    margin-right: 5px;
    color: rgba(255,255,255,0.5);
    vertical-align: super;
  }
  .icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 16px;
    height: 16px;
    margin-right: 8px;
    color: $folderColor;
    vertical-align: super;
  }
  .name {
    display: inline-block;
    width: calc(100% - 60px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;
    color: $text-color;
  }
  .new {
    height: 26px;
    line-height: 26px;
  }
  .new .icon,
  .new .arrow-icon {
    margin-top: 5px;
  }
  .new input {
    vertical-align: top;
    height: 24px;
    line-height: 22px;
    margin: 0 0 0 -1px;
    padding: 0;
    background: transparent;
    color: white;
    outline: none;
    border: $primary-color-lighten solid 1px;
  }
  .new .file-icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 10px;
    height: 16px;
    margin-left: 14px;
    margin-right: 8px;
    margin-top: 5px;
    vertical-align: super;
  }
  .children {
    position: relative;
    padding-left: 13px;
  }
  &:hover .children::after {
    content: '';
    display: block;
    position: absolute;
    left: 5px;
    top: 0;
    width: 1px;
    height: 100%;
    background: rgba(255,255,255,0.25);
  }
}
</style>
