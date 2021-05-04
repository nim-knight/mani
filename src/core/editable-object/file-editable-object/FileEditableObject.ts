import EditableObject from '@/core/editable-object/EditableObject';
import File from '@/core/model/File'

import generateId from '@/core/generateId';

/** 应用配置 */
export default class FileEditableObject extends EditableObject {
  public id = generateId('FileEditableObject');

  public file!: File;

  public get displayName() {
    return this.file.name
  }

  constructor (file: File) {
    super()
    this.file = file
  }
}
