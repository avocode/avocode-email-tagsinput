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
    const tags = options.tags
    const prevTags = options.prevTags || []
    const query = options.query
    const prevQuery = options.prevQuery || ''

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

    return editor.withoutNormalization((thisEditor) => {

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

      addedTags.forEach((tag) => {
        const tagNodes = thisEditor.value.document.getInlinesByType(TAG_PLUGIN_NODE_ID)
        const lastTagNode = tagNodes.last()
        const queryNode = lastTagNode
          ? thisEditor.value.document.getNextSibling(lastTagNode.key)
          : thisEditor.value.document.getLastText()
        const offset = thisEditor.value.document.getOffset(queryNode.key)

        thisEditor
          .moveTo(offset)
          .insertInline({
            ...this._createTag(tag),
            nodes: [ { object: 'text', text: "" } ],
          })
          .moveFocusToEndOfDocument()
      })

      const queryNode = thisEditor.value.document.getTexts().last()

      thisEditor
        .moveToRangeOfNode(queryNode)
        .insertText(query)

      return thisEditor
    })

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
