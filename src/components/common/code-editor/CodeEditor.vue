<template>
  <div class="CodeEditor">
    <div class="vue-codemirror">
      <textarea ref="textarea"></textarea>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { addListener, removeListener } from 'resize-detector'
import codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-darker.css'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/javascript/javascript'

@Component
export default class CodeEditor extends Vue {
  @Prop()
  public value!: string

  @Prop({ default: 'javascript' })
  public mode!: string

  private cminstance!: codemirror.EditorFromTextArea;

  @Watch('value')
  private handelValue() {
    const value = this.cminstance.getValue()
    if (this.value !== value) {
      const cursorPos = this.cminstance.getCursor()
      this.cminstance.setValue(this.value)
      this.cminstance.setCursor(cursorPos)
    }
  }

  private initialize() {
    this.cminstance  = codemirror.fromTextArea(this.$refs.textarea as HTMLTextAreaElement, {
      theme: 'material-darker',
      lineNumbers: true,
      mode: this.mode
    })
    this.cminstance.setValue(this.value)
    this.cminstance.on('change', () => {
      const value = this.cminstance.getValue()
      this.$emit('input', value)
    })
  }

  private setSize() {
    const $el = this.$el as HTMLDivElement
    const w = $el.clientWidth
    const h = $el.clientHeight
    this.cminstance.setSize(w, h)
  }

  private mounted() {
    this.initialize()
    addListener(this.$el as HTMLElement, this.setSize)
    this.setSize()
  }

  private beforeDestroy () {
    removeListener(this.$el as HTMLElement, this.setSize)
  }
}
</script>
<style scoped lang="scss">
@import '~@/style/variables.scss';
.CodeEditor {
  height: 100%;
  ::v-deep {
    div.CodeMirror-selected { background: rgba(255,255,255,0.3) !important;}
  }
}
</style>
