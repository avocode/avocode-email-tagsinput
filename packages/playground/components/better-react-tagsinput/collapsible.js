import React from 'react'
import TagsInput, { CollapsibleTagsInput, utils } from '@avocode/better-react-tagsinput'

export default class Collapsible extends React.PureComponent {
  state = {
    query: '',
    tags: [
      { value: 'this' },
      { value: 'is' },
      { value: 'contained' },
      { value: 'in' },
      { value: 'collapsible' },
      { value: 'input' },
      { value: 'following' },
      { value: 'tags' },
      { value: 'will' },
      { value: 'be' },
      { value: 'hidden' },
      { value: 'and' },
      { value: 'counted!' },
    ],
    count: 0,
  }

  _handleQueryChange = (query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (event, text) => {
    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleTagDeleted = (event, indices) => {
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

  _handleFocus = (editor, event, next, count) => {
    this.setState({ count: 0 })
  }

  _handleTagCountUpdate = (count) => {
    this.setState({ count })
  }

  render() {
    return (
      <div>
        <p>
          The package also exports <code>CollapsibleTagsInput</code> which has the same API as 
          <code>TagsInput</code>.
          This input will collapse on blur and expand on focus. When blur event happens, one of the
          arguments is <b>count</b> which calculates how many tags are non-visible (hidden by collapsing).
        </p>
        <p>
          Hiding the lines in input is done via CSS classes. When input is blurred or focused it appends
          extra class name. You can style these classes to set the heights of focused and blurred state.
        </p>
        <p>
          By default the <b>count</b> calculation considers the visible tags to be on first line only.
          Again this depends on CSS and the way it is set up.
        </p>

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{this.state.tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{this.state.query}</dd>
        </dl>

        <p>
          <strong>Hidden tag count:</strong> <i>{this.state.count}</i>
        </p>

        <CollapsibleTagsInput
          name='collapsible'
          query={this.state.query}
          tags={this.state.tags}
          onTagCountUpdateRequest={this._handleTagCountUpdate}
          onFocus={this._handleFocus}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

