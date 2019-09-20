// @flow

import TagsInput from './components/tagsinput'
import CollapsibleTagsInput from './components/collapsible-tagsinput'
import TagComponent from './components/tag-component'

import schema from './schema'
import * as plugins from './plugins'
import * as utils from './utils'
import { createPlugins } from './plugins/factory'

export default TagsInput

export {
  CollapsibleTagsInput,
  TagComponent,
  schema,
  plugins,
  utils,
  createPlugins,
}
