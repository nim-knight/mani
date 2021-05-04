<template>
  <div class="FileExplorer">
    <DirectoryItem :directory="rootDirectory" :root="true"></DirectoryItem>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Inject } from 'vue-property-decorator'
import ApplicationEditor from '@/components/application-editor/ApplicationEditor.vue'
import DirectoryItem from './DirectoryItem.vue'

@Component({
  components: { DirectoryItem }
})
export default class FileExplorer extends Vue {
  @Inject('app-editor')
  public appEditor!: ApplicationEditor

  private get project() {
    return this.appEditor.project
  }

  private get rootDirectory() {
    return this.project.rootDirectory
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.FileExplorer {
  height: 100%;
}
</style>
