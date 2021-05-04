<template>
  <div class="FileItem"
    @click="handleClick"
    @dblclick="handleDbClick"
  >
    <font-awesome-icon
      class="object-type-icon"
      :icon="icon"
      :style="{
        color: iconColor,
      }"
    />
    <span class="name">{{ file.name }}</span>
    <div class="background"></div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'
import File from '@/core/model/File'

@Component({
  components: { FontAwesomeIcon }
})
export default class FileItem extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  @Prop()
  private file!: File

  private get icon() {
    return ['far', 'file']
  }

  private get iconColor() {
    return '#cd853f'
  }

  public handleClick() {
    this.appEditor.openObjectEditor(this.file.fileEditableObject, null, true)
  }

  public handleDbClick() {
    this.appEditor.openObjectEditor(this.file.fileEditableObject)
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
    margin-left: 14px;
    margin-right: 8px;
    vertical-align: super;
  }
  .name {
    position: relative;
    display: inline-block;
    width: calc(100% - 60px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 13px;
    color: $text-color;
    z-index: 1;
  }
  &:hover .background {
    position: absolute;
    top: 0;
    bottom: 0;
    left: -1000px;
    right: -6px;
    background: rgba(0,0,0,0.25);
    z-index: 0;
  }
}
</style>
