// @flow

import { Point, Value, Selection } from 'slate'
import { TAG_PLUGIN_NODE_ID } from '../plugins/tags'

import type { Query, Tags } from '../types'

const parseValue = (
  tags: Tags,
  query: Query,
  selection: ?Selection
): Value => {
  const tagNodes = tags.map((tag) => {
    return {
      object: 'inline',
      type: TAG_PLUGIN_NODE_ID,
      data: {
        tagContents: tag.value,
        tagState: tag.state,
        ...tag.data,
      },
    }
  })

  const nodes = [
    ...tagNodes,
    { object: 'text', text: query },
  ]


  const valueWithTagNodes = Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes,
        },
      ],
    },
  })

  const prevSelection = valueWithTagNodes.selection

  const anchor = Point.fromJSON({
    key: prevSelection.anchor.key,
    path: selection ?
      selection.anchor.path :
      prevSelection.anchor.path,
    offset: selection ?
      selection.anchor.offset :
      prevSelection.anchor.offset,
  })
  const focus = Point.fromJSON({
    key: prevSelection.focus.key,
    path: selection ?
      selection.focus.path :
      prevSelection.focus.path,
    offset: selection ?
      selection.focus.offset :
      prevSelection.focus.offset,
  })
  const nextSelection = Selection.fromJSON({
    anchor,
    focus,
    isFocused: selection ? selection.isFocused : false,
  })
  const value = valueWithTagNodes.set('selection', nextSelection)

  return value
}

const removeTagsByIndices = (tags: Tags, indices: Array<number>): Tags => {
  return tags.filter((tag, index) => {
    return !indices.includes(index)
  })
}

export {
  parseValue,
  removeTagsByIndices,
}
