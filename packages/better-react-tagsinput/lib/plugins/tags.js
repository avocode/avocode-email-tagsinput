// @flow

import React from 'react'
import TagComponent from '../components/tag-component'
import { TAG_PLUGIN_NODE_ID } from '../constants'

import type { Editor } from 'slate-react'
import type { Selection, Value } from 'slate'
import type { AddTagKeyCodes, Name, PluginFactory, Query, TagComponentFactory } from '../types'

const BACKSPACE_KEY_CODE = 8
const DELETE_KEY_CODE = 46

const EMPTY_TAG_DATA = {}
const EMPTY_TAG_STATE = ''

export default class TagsPlugin implements PluginFactory {
  _addKeys: AddTagKeyCodes
  _name: Name
  _onTagAddedRequest: (text: Query, event: SyntheticKeyboardEvent<*>) => void
  _onTagDeleteRequest: (
    indices: Array<number>,
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    queryNodeText?: Query,
  ) => void
  _onPasteRequest: ?(event: SyntheticClipboardEvent<*>) => void
  _tagComponentFactory: ?TagComponentFactory

  constructor(options: {
    addTagKeyCodes: AddTagKeyCodes,
    name: Name,
    tagComponentFactory: ?TagComponentFactory,
    onTagAddedRequest: (text: Query, event: SyntheticKeyboardEvent<*>) => void,
    onTagDeleteRequest: (
      indices: Array<number>,
      event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
      queryNodeText?: Query,
    ) => void,
    onPasteRequest?: ?(event: SyntheticClipboardEvent<*>) => void,
  }) {
    this._addKeys = options.addTagKeyCodes
    this._name = options.name
    this._tagComponentFactory = options.tagComponentFactory
    this._onTagAddedRequest = options.onTagAddedRequest
    this._onTagDeleteRequest = options.onTagDeleteRequest
    this._onPasteRequest = options.onPasteRequest
  }

  renderNode = (props: Object, editor: Editor, next: Function) => {
    const { node, attributes, children } = props
    const data = node.get('data')

    switch (node.type) {
      case TAG_PLUGIN_NODE_ID: {
        const tagProps = {
          ...attributes,
          isFocused: props.isFocused,
          id: node.key,
          name: this._name,
          contents: data.get('tagContents'),
          state: data.get('tagState') || EMPTY_TAG_STATE,
          data: data.get('data') || EMPTY_TAG_DATA,
          onRemoveButtonClick: editor.removeTag,
          children,
        }
        if (this._tagComponentFactory) {
          return this._tagComponentFactory(tagProps)
        }
        return (
          <TagComponent {...tagProps} />
        )
      }
      default:
        return next()
    }
  }

  onKeyDown = (event: SyntheticKeyboardEvent<*>, editor: Editor, next: Function) => {
    if ([ BACKSPACE_KEY_CODE, DELETE_KEY_CODE ].includes(event.keyCode)) {
      return this._handleRemoveTagByKeyPress(event, editor, next)
    }
    if (this._addKeys.includes(event.keyCode)) {
      return this._handleAddTag(event, editor)
    }

    return next()
  }

  onBeforeInput = (event: SyntheticKeyboardEvent<*>, editor: Editor, next: Function) => {
    // NOTE: Safeguard for handling certain cases (Firefox) where user could
    //       end up between or before tag node(s). Force text insertion at
    //       "query" node (last text block)
    const queryNode = editor.value.document.getTexts().last()
    const currentNodeKey = editor.value.selection.end.key

    if (queryNode && queryNode.key !== currentNodeKey) {
      const currentNode = editor.value.document.getNode(currentNodeKey)
      return editor.moveToStartOfNode(queryNode)
    }

    return next()
  }

  onPaste = (event: SyntheticClipboardEvent<*>, editor: Editor, next: Function) => {
    if (!this._onPasteRequest) {
      return next()
    }

    this._onPasteRequest(event)
  }

  _handleAddTag(event: SyntheticKeyboardEvent<*>, editor: Editor) {
    event.preventDefault()

    const { value } = editor
    const { selection } = value
    const currentNode = value.document.getNode(selection.start.path)

    if (this._onTagAddedRequest) {
      this._onTagAddedRequest(currentNode.text, event)
    }
  }

  _handleRemoveTag = (editor: Editor, event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>, id: string) => {
    const currentTagNodeIndex = this._getTagNodeIndex(editor, event, id)

    if (this._onTagDeleteRequest) {
      this._onTagDeleteRequest([ currentTagNodeIndex ], event)
    }
  }

  _handleRemoveTags = (selection: Selection, value: Value, event: SyntheticKeyboardEvent<*>, next: Function) => {
    const { indices, queryNodeText } = this._getTagNodeIndicesBySelection(selection, value)

    if (indices.length > 0 && this._onTagDeleteRequest) {
      this._onTagDeleteRequest(indices, event, queryNodeText)
      return
    }
    return next()
  }

  _getTagNodeIndex(editor: Editor, event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>, id: string) {
    const tagNodes = editor.value.document.filterDescendants((node) => node.type === TAG_PLUGIN_NODE_ID)
    return tagNodes.findIndex((tagNode) => tagNode.key === id)
  }


  _getTagNodeIndicesBySelection(selection: Selection, value: Value) {
    const selectedNodes = value.document.getNodesAtRange(selection)

    const indices = selectedNodes
      .filter((node) => node.type === TAG_PLUGIN_NODE_ID)
      .map((tagNode, index) => index)
      .toJS()

    const queryNode = value.document.nodes.first().nodes.last()
    const queryNodeText = queryNode ?
      queryNode.text.substring(0, selection.start.offset) + queryNode.text.substring(selection.end.offset) :
      ''

    return { indices, queryNodeText }
  }

  _handleRemoveTagByKeyPress = (event: SyntheticKeyboardEvent<*>, editor: Editor, next: Function) => {
    const { value } = editor
    const { selection } = value

    if (selection.isExpanded) {
      return this._handleRemoveTags(selection, value, event, next)
    }

    const currentNode = value.document.getNode(selection.start.path)
    const currentNodeParent = value.document.getParent(selection.start.path)
    const previousNode = value.document.getPreviousNode(currentNode.key)

    if (
      currentNodeParent.type !== TAG_PLUGIN_NODE_ID &&
      currentNode.text
    ) {
      return next()
    }

    if (currentNodeParent.type === TAG_PLUGIN_NODE_ID) {
      return this._handleRemoveTag(editor, event, currentNodeParent.key)
    }

    if (!previousNode) {
      return next()
    }

    return this._handleRemoveTag(editor, event, previousNode.key)
  }

  initialize() {
    return {
      onKeyDown: this.onKeyDown,
      renderNode: this.renderNode,
      onPaste: this.onPaste,
      onBeforeInput: this.onBeforeInput,
      commands: {
        removeTag: this._handleRemoveTag,
      },
    }
  }
}

