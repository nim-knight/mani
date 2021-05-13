import EditableObject from '@/core/editable-object/EditableObject';
import File from '@/core/file-model/File'

import generateId from '@/core/generateId';
import FileHandler from './FileHandler';

/** 应用配置 */
export default class FileEditableObject extends EditableObject {
  public id = generateId('FileEditableObject');

  public file!: File;
  public fileHandler!: FileHandler

  public get displayName() {
    return this.file.name
  }

  constructor (file: File) {
    super()
    this.file = file
    this.fileHandler = new FileHandler({ propsData: { file: this.file }})
  }
}
