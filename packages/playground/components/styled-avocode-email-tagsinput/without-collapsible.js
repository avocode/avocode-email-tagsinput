// @flow

import React from 'react'
import uuid from 'uuid'
import StyledAvocodeEmailTagsInput, { utils } from '@avocode/styled-avocode-email-tagsinput'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/styled-avocode-email-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class WithoutCollapsible extends React.PureComponent<{}, State> {
  state = {
    tags: [],
    query: '',
  }

  _handleTagAdd = (text: Query) => {
    this.setState((prevState) => {
      return {
        query: '',
        tags: [ ...prevState.tags, { value: text } ],
      }
    })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({ query })
  }

  _handleTagDelete = (indices: Array<number>) => {
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
        <StateView tags={this.state.tags} query={this.state.query} />

        <div className='theme-container theme-container--light'>
          <StyledAvocodeEmailTagsInput
            collapsible={false}
            tags={this.state.tags}
            query={this.state.query}
            onQueryChangeRequest={this._handleQueryChange}
            onTagAddRequest={this._handleTagAdd}
            onTagDeleteRequest={this._handleTagDelete}
          />
        </div>
        <div className='theme-container theme-container--dark'>
          <StyledAvocodeEmailTagsInput
            theme='dark'
            collapsible={false}
            tags={this.state.tags}
            query={this.state.query}
            onQueryChangeRequest={this._handleQueryChange}
            onTagAddRequest={this._handleTagAdd}
            onTagDeleteRequest={this._handleTagDelete}
          />
        </div>
      </div>
    )
  }
}

