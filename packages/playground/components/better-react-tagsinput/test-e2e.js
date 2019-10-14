// @flow

import React from 'react'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class TestE2E extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: [],
  }

  _handleQueryChange = (query: Query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (
    text: Query,
  ) => {
    this.setState((prevState) => {
      return {
        tags: [ ...prevState.tags, { value: text } ],
        query: '',
      }
    })
  }

  _handleTagDeleted = (
    indices: Array<number>,
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

  render() {
    return (
      <div>
        <p>
          This view is used for E2E testing.
        </p>

        <StateView tags={this.state.tags} query={this.state.query} />

        <p>
          <button id="focus-button">Used as focus element</button>
        </p>

        <TagsInput
          tags={this.state.tags}
          query={this.state.query}
          onQueryChangeRequest={this._handleQueryChange}
          onTagAddRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

