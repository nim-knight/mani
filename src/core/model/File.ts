import { JsonObject, JsonProperty } from '@/core/json2typescript'
import FileEditableObject from '../editable-object/file-editable-object/FileEditableObject'

@JsonObject('Directory')
export default class File {
  /** 应用名称 */
  @JsonProperty('name', String, true)
  public name = 'newFile';

  @JsonProperty('content', String, true)
  public content = ''

  public fileEditableObject!: FileEditableObject

  constructor () {
    this.fileEditableObject = new FileEditableObject(this)
  }
}
