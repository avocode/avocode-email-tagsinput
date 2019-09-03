import React from 'react'
import TagsInput from '@avocode/better-react-tagsinput'

export default class BasicWithTagState extends React.PureComponent {
  render() {
    const tags = [
      { value: 'first tag', state: 'error' },
      { value: 'second tag' },
    ]
    const query = 'this is where you type'

    return (
      <div>
        <p>
          Each tag can also include <code>state</code> property so you can
          mark specific tags. By default, the <code>state</code> is used to generate
          specific class name for given tag.
        </p>

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{query}</dd>
        </dl>

        <TagsInput
          name='basic-state'
          tags={tags}
          query={query}
          onTagAddedRequest={() => {}}
          onQueryChangedRequest={() => {}}
          onTagDeleteRequest={() => {}}
        />
      </div>
    )
  }
}

