// @flow

import { Range, Text } from 'slate'

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

    switch (event.keyCode) {
      case ARROW_UP_KEY_CODE:
      case ARROW_DOWN_KEY_CODE:
        event.preventDefault()
        return next()
      case ARROW_LEFT_KEY_CODE: {
        const previousNode = document.getPreviousNode(key)

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
