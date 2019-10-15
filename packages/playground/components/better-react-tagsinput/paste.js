// @flow

import React from 'react'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'

import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class Paste extends React.PureComponent<{}, State> {
  state = { query: '', tags: [] }

  _handlePaste = (event: SyntheticClipboardEvent<*>) => {
    const clipboardData = event.clipboardData.getData('text')

    const tagText = clipboardData.split(',')
    const tags = tagText.map((text) => {
      return { value: text.trim() }
    })
    const query = tags.length ? '' : clipboardData

    this.setState({
      query,
      tags,
    })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (text: Query) => {
    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleTagDeleted = (indices: Array<number>) => {
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
          <code>onPasteRequest</code> prop will enable you to capture paste event. The event will be passed
            to the callback as argument where you can retrieve the values and decide how to separate
            tags and query.
            Any text that you paste in the input will be separated by commas.
        </p>
        <p>
          Try pasting these:<br />
          <code>test1, test2, test3</code>
        </p>

        <StateView tags={this.state.tags} query={this.state.query} />

        <TagsInput
          query={this.state.query}
          tags={this.state.tags}
          onPasteRequest={this._handlePaste}
          onQueryChangeRequest={this._handleQueryChange}
          onTagAddRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

