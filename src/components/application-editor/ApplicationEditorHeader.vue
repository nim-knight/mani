<template>
  <div class="ApplicationEditorHeader">
    <span class="brand">
      <font-awesome-icon
        class="brand-icon"
        :icon="['fas', 'meh-blank']"
      />
    </span>
    <span class="menubar">
      <span class="menu-item">
        <span>项目(P)</span>
        <div class="sub-menu">
          <span>新建</span>
          <span @click="uploadFile">导入</span>
          <span>导出</span>
        </div>
      </span>
      <span class="menu-item">
        <span>查看(V)</span>
      </span>
      <span class="menu-item">
        <span>运行(R)</span>
      </span>
      <span class="menu-item">
        <span>设置(R)</span>
      </span>
      <span class="menu-item">
       <span> 帮助(H)</span>
      </span>
    </span>
    <input type="file" ref="fileInput" accept="application/x-zip-compressed" v-show="false" @change="handleChange">
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Jszip from 'jszip'
import Project from '@/core/file-model/Project'
import Directory from '@/core/file-model/Directory'
import File from '@/core/file-model/File'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'

@Component({
  name: 'ApplicationEditorHeader',
  components: { FontAwesomeIcon }
})
export default class ApplicationEditorHeader extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  private uploadFile() {
    const fileInput = this.$refs.fileInput as HTMLInputElement
    fileInput.value = ''
    fileInput.click()
  }

  private async handleChange (ev: Event) {
    const target = ev.target as HTMLInputElement
    if (
      target.files &&
      target.files.length
    ) {
      try {
        const project = new Project()
        const file = target.files[0]
        const { files } = await Jszip.loadAsync(file)
        const dirs: { [index: string]: Directory} = {}
        for (const [ key, file ] of Object.entries(files).sort()) {
          if (key.endsWith('/')) {
            const array = key.split('/')
            const dir = new Directory()
            const name = array[array.length - 2]
            const parentPath = array.slice(0, -2).join('/')
            const path = parentPath ? parentPath + '/' + name : name

            dir.name = array[array.length - 2]
            dirs[path] = dir

            if (parentPath) {
              const parentDirectory = dirs[parentPath]
              if (!parentDirectory) {
                debugger
              }
              parentDirectory.directorys.push(dir)
            } else {
              project.rootDirectory.directorys.push(dir)
            }
          } else {
            const content = await file.async('string')
            const base64 = await file.async('base64')
            const array = key.split('/')
            const newFile = new File()
            newFile.content = content
            newFile.base64 = base64
            if (array && array.length > 1) {
              console.log(array)
              const name = array[array.length - 1]
              const parentPath = array.slice(0, -1).join('/')
              const parentDirectory = dirs[parentPath]
              newFile.name = name
              parentDirectory.files.push(newFile)
            } else {
              const name = key
              newFile.name = name
              project.rootDirectory.files.push(newFile)
            }
          }
        }
        this.appEditor.openProject(project)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.ApplicationEditorHeader {
  background: $panel-background-color;
  height: $header-height;
  line-height: $header-height;
  padding: 0 10px;
  .brand {
    display: inline-block;
    margin-top: 3px;
    margin-right: 10px;
    height: 25px;
    width: 25px;
    line-height: 25px;
    border-radius: 3px;
    text-align: center;
    font-size: 18px;
    background: #001e36;
    color: #2c9aeb;
  }
  .menubar {
    display: inline-block;
    vertical-align: top;
    .menu-item {
      position: relative;
      display: inline-block;
      height: 100%;
      padding: 0 15px;
      cursor: pointer;
    }
    .menu-item:hover {
      background: lighten($panel-background-color, 5%);
      box-shadow: 0px 1px 2px #000;
    }
    .sub-menu {
      display: none;
      position: absolute;
      left: 0;
      background: lighten($panel-background-color, 5%);
      width: 225px;
      z-index: 100;
    }
    .menu-item:hover .sub-menu {
      display: block;
      box-shadow: 0px 1px 2px #000;
    }
    .sub-menu span {
      display: block;
      padding: 0 15px;
    }
    .sub-menu span:hover {
      background: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
