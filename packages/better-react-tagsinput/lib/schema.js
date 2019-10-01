// @flow

import { Block } from 'slate'
import { TAG_PLUGIN_NODE_ID } from './constants'

import type { Editor } from 'slate-react'
import type { Node } from 'slate'

export default {
  document: {
    nodes: [
      {
        match: [
          {
            type: 'paragraph',
            min: 1,
          },
          {
            type: TAG_PLUGIN_NODE_ID,
          },
        ],
      },
    ],
    last: { type: 'paragraph' },
    normalize: (
      editor: Editor,
      { code, node }: { code: string, node: Node }
    ) => {
      switch (code) {
        case 'last_child_type_invalid': {
          const paragraph = Block.create('paragraph')
          return editor.insertNodeByKey(node.key, node.nodes.size, paragraph)
        }
      }
    },
  },
  inlines: {
    [TAG_PLUGIN_NODE_ID]: {
      isVoid: true,
    },
  },
}
