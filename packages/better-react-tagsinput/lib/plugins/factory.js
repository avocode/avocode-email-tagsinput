// @flow

import TagsPlugin from './tags'
import KeyboardNavigationPlugin from './keyboard-navigation'
import UpdateValuePlugin from './update-value'

import type { Plugin, FactoryPluginOptions } from '../types'

const createPlugins = (
  options: FactoryPluginOptions
): Array<Plugin> => {
  const tagsPlugin = new TagsPlugin({
    addTagKeyCodes: options.addTagKeyCodes,
    name: options.name,
    tagComponentFactory: options.tagComponentFactory,
    onTagAddedRequest: options.onTagAddedRequest,
    onTagDeleteRequest: options.onTagDeleteRequest,
    onPasteRequest: options.onPasteRequest,
  })

  const pluginInstances = [
    tagsPlugin,
    new UpdateValuePlugin(),
    new KeyboardNavigationPlugin(),
  ]

  return pluginInstances.map((plugin) => {
    return plugin.initialize()
  })
}

export { createPlugins }
