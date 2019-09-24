// @flow

import React from 'react'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'

import CustomTagComponent from './custom-tag-component'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}


export default class CustomTag extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: [ { value: 'a' }, { value: 'b' } ],
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
          By passing <code>tagComponentFactory</code> you can render your own React component for
          tag items.
          The props is a render prop that receives <code>props</code> object. See source code for this page (or the library default component) on how these props should be applied.
        </p>

        <StateView tags={this.state.tags} query={this.state.query} />

        <TagsInput
          tags={this.state.tags}
          query={this.state.query}
          tagComponentFactory={(props) => (
            <CustomTagComponent {...props} />
          )}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

