export default class EditableObject {
  /** 组件唯一标识符(UUID) */
  public id!: string

  public get displayName (): string {
    return ''
  }
}
