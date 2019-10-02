// @flow

import { Value } from 'slate'

export default () => {
  return Value.fromJSON({
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: '',
            },
          ],
        },
      ],
    },
  })
}

