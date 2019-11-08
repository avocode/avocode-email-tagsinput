// @flow

import React from 'react'
import { CollapsibleTagsInput, utils } from '@avocode/better-react-tagsinput'
import uuid from 'uuid'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: string,
  tags: Tags,
  count: number,
}

export default class TestE2ECollapsible extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: [],
    count: 0,
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

  _handleFocus = () => {
    this.setState({ count: 0 })
  }

  _handleTagCountUpdate = (count: number) => {
    this.setState({ count })
  }

  _handleTagAddedProgrammatically = () => {
    const randomString = uuid.v4().slice(0, 6)

    this._handleTagAdded(randomString)
  }

  render() {
    return (
      <div>
        <StateView tags={this.state.tags} query={this.state.query} />

        <p>
          <button id="focus-button">Used as focus element</button>
        </p>

        <p>
          <button id="add-tag" onClick={this._handleTagAddedProgrammatically}>
            Add tag programmatically
          </button>
        </p>

        <p>
          <span id="counter">{this.state.count}</span>
        </p>

        <CollapsibleTagsInput
          name='e2e-collapsing-input'
          query={this.state.query}
          tags={this.state.tags}
          onQueryChangeRequest={this._handleQueryChange}
          onTagAddRequest={this._handleTagAdded}
          onTagCountUpdateRequest={this._handleTagCountUpdate}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

