<template>
  <div class="CreateNew" v-show="show">
    <template v-if="isDirectory">
      <font-awesome-icon
        class="arrow-icon"
        :icon="['fas', 'chevron-right']"
      />
      <font-awesome-icon
        class="icon"
        :icon="['fas', 'folder']"
      />
      <NameEditor
        class="name"
        ref="nameEditor"
        v-model="name"
        @input="handleInput"
        @hidden="close()"
      ></NameEditor>
    </template>
    <template v-else>
      <font-awesome-icon
        class="file-icon"
        :icon="['far', 'file']"
      />
      <NameEditor
        class="name"
        ref="nameEditor"
        v-model="name"
        @input="handleInput"
        @hidden="close()"
      ></NameEditor>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import NameEditor from './NameEditor.vue'
import DirectoryItem from './DirectoryItem.vue'
import Directory from '@/core/file-model/Directory'
import File from '@/core/file-model/File'

@Component({
  components: {
    FontAwesomeIcon,
    NameEditor
  }
})
export default class CreateNew extends Vue {
  @Prop({ default: false })
  private isDirectory!: boolean

  public get siblings() {
    if (this.$parent instanceof DirectoryItem) {
      const directorys = this.$parent.directory.directorys
      const files = this.$parent.directory.files
      return [...directorys, ...files]
    }
    return []
  }

  private show = false

  private name = ''

  public open() {
    this.name = this.isDirectory? 'newFolder' : 'newFile'
    this.show = true
    this.$nextTick(() => {
      const nameEditor = this.$refs.nameEditor as NameEditor
      nameEditor.startInput()
    })
  }

  public close() {
    this.show = false
    this.name = ''
  }

  private handleInput() {
    this.show = false
    if (this.$parent instanceof DirectoryItem) {
      const directorys = this.$parent.directory.directorys
      const files = this.$parent.directory.files

      if (this.isDirectory) {
        const directory = new Directory()
        directory.name = this.name
        directorys.push(directory)
      } else {
        const file = new File()
        file.name = this.name
        files.push(file)
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
$folderColor: #90a4ae;

.CreateNew {
  .arrow-icon {
    display: inline-block;
    position: relative;
    top: -3px;
    width: 10px;
    height: 10px;
    margin-top: 6px;
    margin-right: 5px;
    color: rgba(255,255,255,0.5);
  }
  .icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 16px;
    height: 16px;
    margin-top: 5px;
    margin-right: 8px;
    color: $folderColor;
  }
  .file-icon {
    display: inline-block;
    position: relative;
    top: 0px;
    width: 10px;
    height: 16px;
    margin-left: 17px;
    margin-right: 11px;
    margin-top: 5px;
    vertical-align: super;
  }
  .name {
    position: absolute;
    display: inline-block;
    width: calc(100% - 60px);
    height: 26px;
    overflow: visible;
  }
}
</style>
