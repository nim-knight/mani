import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { ASTElement, compile } from 'vue-template-compiler'

import throttle from 'lodash.throttle'

import File from '@/core/model/File'
import PageConfig from './PageContainer'

@Component
export default class VueFileHandler extends Vue {
  @Prop()
  public file!: File

  public get content() {
    return this.file.content
  }

  public set content(content: string) {
    this.file.content = content
  }

  public get ast() {
    const result = compile(this.content, {
      outputSourceRange: true
    })
    console.warn(result.errors)
    return result.ast
  }

  public get astElements() {
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
    this.ast && traverse(this.ast)
    return astElements
  }

  public get pageContainerASTElement() {
    return this.astElements.find((d) => d.tag === 'PageContainer')
  }

  public get widgetASTElements() {
    return this.astElements.filter((d) => d.tag === 'Widget')
  }

  public get pageConfig() {
    if (!this.pageContainerASTElement) {
      return null
    }
    const pageConfig = new PageConfig()
    const attrs = this.pageContainerASTElement.attrs || []
    for (const {name, value} of attrs) {
      if (Object.prototype.hasOwnProperty.call(pageConfig, name)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pageConfigObj = (pageConfig as any)
        if (typeof pageConfigObj[name] === 'number') {
          pageConfigObj[name] = isNaN(value)? 0 : Number(value)
        } else {
          pageConfigObj[name] = value
        }
      }
    }
    return Vue.observable(pageConfig)
  }

  public get widgetConfigs() {
    // return this.widgetASTElements.map(d => d.attrsMap.name)
    return []
  }

  @Watch('content', { deep: true })
  private handleContentChange() {
    // this.locked = true
  }

  @Watch('pageConfig', { deep: true })
  private handlePageConfigChange() {
    console.log(this.pageConfig)
    this.updateContentDebounce()
  }

  private updateContentDebounce = throttle(() => {
    this.updateContent()
  }, 100)

  private updateContent () {
    if (!this.pageConfig) {
      return
    }
    const pageContainerASTElement = this.pageContainerASTElement
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const start = (pageContainerASTElement as any).start || -1
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const end = (pageContainerASTElement?.children[0] as any)?.start || -1

    const indent = this.getIndent(start)
    const arrTol = `\n${this.indentText(indent + 2)}`
    const endTol = `\n${this.indentText(indent)}`
    const stratStr = this.content.slice(0, start)
    const endStr = this.content.slice(end)
    console.log(this.pageConfig)
    const newStr = `<PageContainer ${arrTol}:width="${this.pageConfig.width}"${arrTol}:height="${this.pageConfig.height}"${arrTol}:bgColor="${this.pageConfig.bgColor}"${endTol}>${arrTol}`
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