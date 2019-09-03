import React from 'react'
import TagsInput from '@avocode/better-react-tagsinput'

export default class Basic extends React.PureComponent {
  render() {
    const tags = [
      { value: 'first tag' },
      { value: 'second tag' },
    ]
    const query = 'this is where you type'

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

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{query}</dd>
        </dl>

        <TagsInput
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

