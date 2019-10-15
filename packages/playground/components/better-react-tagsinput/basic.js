// @flow

import React from 'react'
import TagsInput from '@avocode/better-react-tagsinput'
import StateView from '../state-view'

export default class Basic extends React.PureComponent<{}> {
  render() {
    const tags = [
      { value: 'first tag' },
      { value: 'second tag' },
    ]
    const query = 'query'

    return (
      <div>
        <p>
          <code>TagsInput</code> is controlled component. It needs to pass values
            via <code>tags</code> and <code>query</code> properties as well as logic
            to modify these.
          <br />
          This example will therefore only display data and allow you to change
          the input but will not actually change the props.
        </p>

        <StateView tags={tags} query={query} />

        <TagsInput
          tags={tags}
          query={query}
          onQueryChangeRequest={() => {}}
          onTagAddRequest={() => {}}
          onTagDeleteRequest={() => {}}
        />
      </div>
    )
  }
}

