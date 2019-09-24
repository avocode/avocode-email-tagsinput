// @flow

import React from 'react'
import AvocodeEmailTagsInput, { utils } from '@avocode/avocode-email-tagsinput'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/avocode-email-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class LongInput extends React.PureComponent<{}, State> {
  state = {
    tags: [
      { value: 'thisisaverylongemailaddress@somecrazylongdomain.co.xyz.com' },
      { value: 'test2@test.com' },
    ],
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
    this.setState((prevState) => {
      return {
        query: query.length > 50 ? prevState.query : query,
      }
    })
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
        <p>
          By hooking into <code>onQueryChangedRequest</code> method you can limit the amount
          of characters user types into the input.

          Also the default styling shortens very long emails by styling the tag component.
        </p>

        <StateView tags={this.state.tags} query={this.state.query} />

        <AvocodeEmailTagsInput
          name='long-input'
          tags={this.state.tags}
          query={this.state.query}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleTagAdd}
          onTagDeleteRequest={this._handleTagDelete}
        />
      </div>
    )
  }
}

