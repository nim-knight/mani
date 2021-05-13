import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ASTElement, compile } from 'vue-template-compiler'
import File from '@/core/file-model/File'
import PageConfig from '@/core/model/PageContainer'
import throttle from 'lodash.throttle'

@Component
export default class FileHandler extends Vue {
  @Prop()
  public file!: File

  public get fileName() {
    return this.file.name
  }

  public get content() {
    return this.file.content
  }

  public set content(content: string) {
    this.file.content = content
  }

  public get vueAst() {
    if (this.fileName.endsWith('.vue')) {
      const result = compile(this.content, {
        outputSourceRange: true
      })
      return result.ast
    }
    return null
  }

  public get vueAstElements() {
    const astElements: ASTElement[] = []
    const traverse = (el: ASTElement ) => {
      if(el.tag) {
        astElements.push(el)
      }
      for (const child of el.children) {
        if( child.type === 1) {
          traverse(child)
        }
      }
    }
    this.vueAst && traverse(this.vueAst)
    return astElements
  }

  public get pageContainerASTElement() {
    return this.vueAstElements.find((d) => d.tag === 'PageContainer')
  }

  public get pageConfig() {
    if (!this.pageContainerASTElement) {
      return null
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawAttrsMap = (this.pageContainerASTElement as any).rawAttrsMap || {}

    const getValue = (key: string) => {
      return (rawAttrsMap[key] || rawAttrsMap[':' + key])?.value
    }

    const pageConfig = new PageConfig()
  
    pageConfig.width = Number(getValue('width')) || pageConfig.width
    pageConfig.height = Number(getValue('height')) || pageConfig.height
    pageConfig.bgColor = getValue('bgColor') || pageConfig.bgColor

    return Vue.observable(pageConfig)
  }

  @Watch('pageConfig', { deep: true })
  private handlePageConfigChange(newValue: PageConfig, oldVlaue: PageConfig) {
    if(newValue !== oldVlaue) {
      return
    }
    this.updateContentThrottle()
  }

  private updateContentThrottle = throttle(() => {
    this.updateContentForPageConfig()
  }, 100)

  private updateContentForPageConfig () {
    if (!this.pageConfig) {
      return
    }
    const pageContainerASTElement = this.pageContainerASTElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const start = (pageContainerASTElement as any).start || -1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const end = (pageContainerASTElement as any).end || -1

    const indent = this.getIndent(start)
    const arrTol = `\n${this.indentText(indent + 2)}`
    const endTol = `\n${this.indentText(indent)}`
    const stratStr = this.content.slice(0, start)
    const endStr = this.content.slice(end)
    const newStr = `<PageContainer ${arrTol}:width="${this.pageConfig.width}"${arrTol}:height="${this.pageConfig.height}"${arrTol}bgColor="${this.pageConfig.bgColor}"${endTol}>${endTol}</PageContainer>`
    this.content = `${stratStr}${newStr}${endStr}`
  }

  private getIndent(index: number) {
    let indent = 0
    const next = () => this.content.charAt(--index) === ' '
    while (next()) {
      indent++
    }
    return indent
  }

  private indentText(indent: number) {
    return Array(indent).fill(' ').join('')
  }
}
