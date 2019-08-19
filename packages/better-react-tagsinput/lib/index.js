// @flow

import TagsInput from './components/tagsinput'
import CollapsibleTagsInput from './components/collapsible-tagsinput'

import schema from './schema'
import * as plugins from './plugins'
import * as utils from './utils'
import { createPlugins } from './plugins/factory'

export default TagsInput

export {
  schema,
  plugins,
  utils,
  createPlugins,
  CollapsibleTagsInput,
}
