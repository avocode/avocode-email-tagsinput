import React from 'react'
import AvocodeEmailTagsInput, { utils } from '@avocode/avocode-email-tagsinput'

export default class Controlled extends React.PureComponent {
  state = { tags: [ { value: 'test@test.com' }, { value: 'test2@test.com' } ], query: '' }

  _handleTagAdd = (event, text) => {
    this.setState((prevState) => {
      return {
        query: '',
        tags: [ ...prevState.tags, { value: text } ],
      }
    })
  }

  _handleQueryChange = (query) => {
    this.setState({ query })
  }

  _handleTagDelete = (event, indices) => {
    this.setState((prevState) => {
      const nextTags = utils.removeTagsByIndices(
        prevState.tags,
        indices
      )

      return {
        tags: nextTags,
      }
    })
  }


  render() {
    return (
      <div>
        <p>
          If you need to, you can make <code>AvocodeEmailTagsInput</code> also a controlled
          component. This can be useful for modifying <code>state</code> property on
          tags values (f.e. server errors).
        </p>

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{this.state.tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{this.state.query}</dd>
        </dl>

        <AvocodeEmailTagsInput
          tags={this.state.tags}
          query={this.state.query}
          onTagAddedRequest={this._handleTagAdd}
          onQueryChangedRequest={this._handleQueryChange}
          onTagDeleteRequest={this._handleTagDelete}
        />
      </div>
    )
  }
}

