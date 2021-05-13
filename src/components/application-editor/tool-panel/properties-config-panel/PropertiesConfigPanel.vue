<template>
  <div class="PropertiesConfigPanel">
    <div>{{pageConfig}}</div>
    <div v-if="pageConfig">
      <div>
        <span>width</span>
        <input type="number" v-model="pageConfig.width">
      </div>
      <div>
        <span>height</span>
        <input type="number" v-model="pageConfig.height">
      </div>
      <div>
        <span>bgColor</span>
        <input type="color" v-model="pageConfig.bgColor">
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'
import FileEditableObject from '@/core/editable-object/file-editable-object/FileEditableObject'

@Component
export default class PropertiesConfigPanel extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  private get fileEditableObject() {
    const currentEditableObject = this.appEditor.currentEditableObject
    if (currentEditableObject instanceof FileEditableObject) {
      return currentEditableObject
    }
    return null
  }
  
  private get file() {
    return this.fileEditableObject?.file
  }

  private get fileHandler() {
    return this.fileEditableObject?.fileHandler
  }

  private get pageConfig() {
    return this.fileHandler?.pageConfig
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.PropertiesConfigPanel {
  height: 100%;
}
</style>
