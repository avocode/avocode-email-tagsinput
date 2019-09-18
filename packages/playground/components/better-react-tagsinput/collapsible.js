// @flow

import React from 'react'
import TagsInput, { CollapsibleTagsInput, utils } from '@avocode/better-react-tagsinput'

import type { Editor } from 'slate-react'
import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: string,
  tags: Tags,
  count: number,
}

export default class Collapsible extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: [
      { value: 'Lorem' },
      { value: 'ipsum' },
      { value: 'dolor' },
      { value: 'sit' },
      { value: 'amet' },
      { value: 'consectetur' },
      { value: 'adipiscing' },
      { value: 'elit' },
      { value: 'sed' },
    ],
    count: 0,
  }

  _handleQueryChange = (query: Query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (
    text: Query,
    event: SyntheticKeyboardEvent<*>,
  ) => {
    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleRandomTagAdded = () => {
    const text = `${Date.now().toString().substring(8)}@avcd.cz`

    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleTagDeleted = (
    indices: Array<number>,
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
  ) => {
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

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function,
  ) => {
    this.setState({ count: 0 })
  }

  _handleTagCountUpdate = (count: number) => {
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
          By default the <b>count</b> calculation considers the visible tags to be on the last line only. If you add new tags and overflow container is set up, the view is scrolled to last line.
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

        <p>
          <button onClick={this._handleRandomTagAdded}>Add random tag</button>
        </p>

        <CollapsibleTagsInput
          name='collapsing-input'
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

