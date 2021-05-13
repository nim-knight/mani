import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faMagic,
  faFolder,
  faFolderOpen,
  faChevronRight,
  faChevronDown,
  faTimes,
  faPlus,
  faArchway,
  faMehBlank,
  faChevronCircleRight,
  faChevronCircleDown,
  faPen
} from '@fortawesome/free-solid-svg-icons'

import { faFile, faFileImage } from '@fortawesome/free-regular-svg-icons'
import { faVuejs } from '@fortawesome/free-brands-svg-icons'

library.add(faMagic)
library.add(faFile)
library.add(faFolder)
library.add(faFolderOpen)
library.add(faChevronRight)
library.add(faChevronDown)
library.add(faTimes)
library.add(faPlus)
library.add(faArchway)
library.add(faMehBlank)
library.add(faVuejs)
library.add(faChevronCircleRight)
library.add(faChevronCircleDown)
library.add(faPen)
library.add(faFileImage)

export { default as ApplicationEditor } from '@/components/application-editor/ApplicationEditor.vue'