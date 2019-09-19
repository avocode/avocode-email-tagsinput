// @flow

import { Range } from 'slate'

import { TAG_PLUGIN_NODE_ID } from './tags'

import type { Node } from 'slate'
import type { Editor } from 'slate-react'
import type { PluginFactory, Query, Tag, Tags, } from '../types.js'

export default class UpdateValuePlugin implements PluginFactory {
  _updateValue = (
    editor: Editor, options: {
      tags: Tags,
      prevTags?: Tags,
      query: Query,
      prevQuery?: Query,
    }
  ) => {
    console.time('update_value')
    const tags = options.tags
    const prevTags = options.prevTags || []
    const query = options.query
    const prevQuery = options.prevQuery || ''

    if (query !== prevQuery) {
      this._replaceQuery(editor, query)
    }

    // NOTE: Don't bother with tags at all if they haven't changed
    if (tags === prevTags) {
      return
    }

    const compareDesc = this._compareTags(prevTags, tags)
    const addedTags = tags.slice(prevTags.length)

    if (
      compareDesc.updatedIndices.length < 1 &&
      compareDesc.removeIndices.length < 1 &&
      addedTags.length < 1
    ) {
      return
    }

    const tagNodes =
      editor.value.document.getInlinesByType(TAG_PLUGIN_NODE_ID)

    const updateDescs = this._getUpdateDescriptors(
      tagNodes,
      compareDesc,
      tags
    )

    editor.withoutNormalization((thisEditor) => {

      updateDescs.updateDescs.forEach((desc) => {
        const  { key, tag } = desc
        thisEditor.setNodeByKey(
          key,
          { data: {
            tagContents: tag.value,
            tagState: tag.state,
            data: tag.data,
          } }
        )
      })

      updateDescs.removeDescs.forEach((desc) => {
        const  { key, tag } = desc
        thisEditor.removeNodeByKey(key)
      })
    })

    addedTags.forEach((tag) => {
      const tagNodes = editor.value.document.getInlinesByType(TAG_PLUGIN_NODE_ID)
      const lastTagNode = tagNodes.last()
      const queryNode = lastTagNode
        ? editor.value.document.getNextSibling(lastTagNode.key)
        : editor.value.document.getLastText()
      const offset = editor.value.document.getOffset(queryNode.key)

      editor.moveTo(offset).insertInline(this._createTag(tag)).moveFocusToEndOfDocument()
    })
    console.timeEnd('update_value')
  }

  _compareTags(prevTags: Tags, tags: Tags) {
    return prevTags.reduce((desc, tag, index) => {
      const nextTag = tags[index]

      if (!nextTag) {
        return {
          ...desc,
          removeIndices: [
            ...desc.removeIndices,
            index
          ],
        }
      }

      if (
        nextTag.value !== tag.value ||
        nextTag.state !== tag.state
      ) {
        return {
          ...desc,
          updatedIndices: [
            ...desc.updatedIndices,
            index,
          ]
        }
      }

      return desc
    }, {
      removeIndices: [],
      updatedIndices: [],
    })
  }

  _getUpdateDescriptors(
    tagNodes: List<Node>,
    compareDesc,
    tags
  ) {
    return tagNodes.reduce((desc, tagNode, index, array) => {
      let nextDesc = desc
      const tag = tags[index]
      if (compareDesc.updatedIndices.includes(index)) {
        nextDesc = {
          ...nextDesc,
          updateDescs: [ ...nextDesc.updateDescs,
            { key: tagNode.key, tag }
          ],
        }
      }

      if (compareDesc.removeIndices.includes(index)) {
        nextDesc = {
          ...nextDesc,
          removeDescs: [ ...nextDesc.removeDescs,
            { key: tagNode.key, tag }
          ],
        }
      }

      return nextDesc
    }, {
      removeDescs: [],
      updateDescs: [],
    })
  }

  _createValue = (
    editor: Editor, options: {
      tags: Tags,
      query: Query,
    }
  ) => {
    const { tags, query } = options

    this._createTags(editor, tags)
    this._createQuery(editor, query)
  }

  _createTags(editor: Tag, tags: Tags) {
    tags.forEach((tag) => {
      editor
        .insertInline(this._createTag(tag))
        .moveFocusToEndOfDocument()
    })
  }

  _createQuery(editor, query) {
    editor
      .insertText(query)
      .moveFocusToEndOfDocument()
  }

  _replaceQuery(editor, query) {
    const selection = editor.value.selection

    if (selection.isExpanded) {
      const range = Range.create({
        anchor: {
          key: selection.anchor.key,
          path: selection.anchor.path.toJS(),
          offset: selection.anchor.offset,
        },
        focus: {
          key: selection.focus.key,
          path: selection.focus.path.toJS(),
          offset: selection.focus.offset,
        }
      })

      editor.insertTextAtRange(range, query)
      return
    }

    const currentNode = editor.value.document.getNode(
      editor.value.selection.end.key
    )

    if (!currentNode) {
      this._createQuery(editor, query)
      return
    }

    editor
      .moveToRangeOfNode(currentNode)
      .insertText(query)
  }

  _createTag(tag: Tag) {
    return {
      type: TAG_PLUGIN_NODE_ID,
      data: {
        tagContents: tag.value,
        tagState: tag.state,
        data: tag.data,
      }
    }
  }

  initialize() {
    return {
      commands: {
        createValue: this._createValue,
        updateValue: this._updateValue,
      }
    }
  }
}
