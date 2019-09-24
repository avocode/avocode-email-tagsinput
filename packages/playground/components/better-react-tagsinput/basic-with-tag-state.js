// @flow

import React from 'react'
import TagsInput from '@avocode/better-react-tagsinput'
import StateView from '../state-view'

export default class BasicWithTagState extends React.PureComponent<{}> {
  render() {
    const tags = [
      { value: 'first tag', state: 'error' },
      { value: 'second tag' },
    ]
    const query = 'query'

    return (
      <div>
        <p>
          Each tag can also include <code>state</code> property so you can
          mark specific tags. By default, the <code>state</code> is used to generate
          specific class name for given tag.
        </p>

        <StateView tags={tags} query={query} />

        <TagsInput
          name='basic-state'
          tags={tags}
          query={query}
          onQueryChangedRequest={() => {}}
          onTagAddedRequest={() => {}}
          onTagDeleteRequest={() => {}}
        />
      </div>
    )
  }
}

