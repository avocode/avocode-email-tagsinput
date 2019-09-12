// @flow

import TagsPlugin from './tags'
import KeyboardNavigationPlugin from './keyboard-navigation'

import type { Plugin, FactoryPluginOptions } from '../types.js'

const createPlugins = (
  options: FactoryPluginOptions
): Array<Plugin> => {
  const tagsPlugin = new TagsPlugin({
    addTagKeyCodes: options.addTagKeyCodes,
    name: options.name,
    onTagAddedRequest: options.onTagAddedRequest,
    onTagDeleteRequest: options.onTagDeleteRequest,
    onPasteRequest: options.onPasteRequest,
  })

  const pluginInstances = [
    tagsPlugin,
    new KeyboardNavigationPlugin(),
  ]

  return pluginInstances.map((plugin) => {
    return plugin.initialize()
  })
}

export { createPlugins }
