import ObjectEditor from '@/components/application-editor/object-editor/FileEditor.vue'
import EditableObject from '@/core/editable-object/EditableObject'
import FileEditableObject from '@/core/editable-object/file-editable-object/FileEditableObject'

import { VueConstructor } from 'vue'
import FileEditor from '@/components/application-editor/object-editor/FileEditor.vue'
import VueFileEditor from '@/components/application-editor/object-editor/VueFileEditor.vue'

// eslint-disable-next-line
type Constructor<T> = new(...args: any[]) => T;
interface EditableObjectTypeInfo {
  name: string;
  constructor: Constructor<EditableObject>;
  fileSuffix?: string;
  editors: VueConstructor[];
  icon: string[];
  color: string;
  // eslint-disable-next-line
  getChildren: (applicationConfig: any) => EditableObject[];
}

export const editableObjectTypeInfos: EditableObjectTypeInfo[] = [
  {
    name: 'Vue文件',
    constructor: FileEditableObject,
    editors: [VueFileEditor],
    fileSuffix: 'vue',
    icon: ['fab', 'vuejs'],
    color: '#3fb884',
    getChildren: applicationConfig => applicationConfig.pageConfigs
  },
  {
    name: '文件',
    constructor: FileEditableObject,
    editors: [FileEditor],
    icon: ['far', 'file'],
    color: '#ff6600',
    getChildren: applicationConfig => applicationConfig.pageConfigs
  }
]

export function getEditableObjectTypeInfo (editableObject: EditableObject) {
  const find = editableObjectTypeInfos.find((editableObjectTypeInfo) => {
    const constructorMatch = editableObject instanceof editableObjectTypeInfo.constructor
    const fileSuffixMatch = editableObjectTypeInfo.fileSuffix ?
      (editableObject.displayName.endsWith(editableObjectTypeInfo.fileSuffix)) :
      true
    return constructorMatch && fileSuffixMatch
  })
  return find;
}

export function getDefaultEditor (editableObject: EditableObject) {
  const find = getEditableObjectTypeInfo(editableObject)
  return find?.editors[0] || ObjectEditor;
}
