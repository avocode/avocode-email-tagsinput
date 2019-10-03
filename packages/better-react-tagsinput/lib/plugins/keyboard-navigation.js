// @flow

import { Range, Text } from 'slate'
import { TAG_PLUGIN_NODE_ID } from '../constants'

import type { Editor } from 'slate-react'
import type { Node } from 'slate'
import type { PluginFactory } from '../types'


const ARROW_LEFT_KEY_CODE = 37
const ARROW_RIGHT_KEY_CODE = 39
const ARROW_UP_KEY_CODE = 38
const ARROW_DOWN_KEY_CODE = 40
const KEY_CODES = [
  ARROW_LEFT_KEY_CODE,
  ARROW_RIGHT_KEY_CODE,
  ARROW_UP_KEY_CODE,
  ARROW_DOWN_KEY_CODE,
]

export default class KeyboardNavigationPlugin implements PluginFactory {
  onKeyDown = (event: SyntheticKeyboardEvent<*>, editor: Editor, next: Function) => {
    if (!KEY_CODES.includes(event.keyCode)) {
      return next()
    }

    const { value } = editor
    const { selection, document } = value
    const { path, key } = selection.start
    const currentNode = document.getNode(key)
    const tagNodeCount = document.getInlinesByType(TAG_PLUGIN_NODE_ID).size

    switch (event.keyCode) {
      case ARROW_UP_KEY_CODE:
      case ARROW_DOWN_KEY_CODE:
        event.preventDefault()
        return next()
      case ARROW_LEFT_KEY_CODE: {
        const previousNode = document.getPreviousNode(key)

        // NOTE: There can be a case when you could move focus
        //       before the first tag node, this prevents it
        if (tagNodeCount > 0 && selection.isExpanded) {
          const parentNode = document.getAncestors(currentNode.key).find((ancestor) => ancestor.type === 'paragraph')
          const currentNodeIndex = parentNode.nodes.findIndex((node) => node === currentNode)

          if (currentNodeIndex === 0) {
            const queryNode = document.getTexts().last()
            event.preventDefault()
            return queryNode ? editor.moveToStartOfNode(queryNode) : next()
          }
        }

        if (previousNode && this._nodeIsText(previousNode)) {
          const previousInline = document.getPreviousNode(previousNode.key)
          const previousInlineTextNode = previousInline ? previousInline.nodes.first() : null

          return previousInlineTextNode ?
            editor
              .moveFocusTo(previousInlineTextNode.key)
              .moveAnchorTo(previousInlineTextNode.key) :
            editor
              .moveFocusTo(currentNode.key)
              .moveAnchorTo(currentNode.key)
        }
        return next()
      }
      case ARROW_RIGHT_KEY_CODE: {
        const nextNode = document.getNextNode(key)

        if (nextNode && this._nodeIsText(nextNode)) {
          const nextInline = document.getNextNode(nextNode.key)
          const nextInlineTextNode = nextInline ? nextInline.nodes.first() : null

          return nextInlineTextNode ?
            editor
              .moveFocusTo(nextInlineTextNode.key)
              .moveAnchorTo(nextInlineTextNode.key) :
            next()
        }
        return next()
      }
      default:
        return next()
    }
  }

  _nodeIsText(node: Node): boolean {
    return node.constructor === Text
  }

  initialize() {
    return {
      onKeyDown: this.onKeyDown,
    }
  }
}
