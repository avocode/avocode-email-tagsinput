// @flow

import React from 'react'
import StyledAvocodeEmailTagsInput, { utils } from '@avocode/styled-avocode-email-tagsinput'

import type { Query, Tags } from '@avocode/styled-avocode-email-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

export default class Basic extends React.PureComponent<{}, State> {
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
        <p>
          <code>StyledAvocodeTagsInput</code> is input for inserting tags that are valid emails. By default it
          should <i>"just work"</i>.
          Try typing valid email and hitting <i>Comma</i>, <i>Enter</i> or <i>Space</i> to add new tag.
        </p>

        <p>
          By passing prop <code>theme</code> with values <code>light</code> or <code>dark</code> the input component will be appropriately styled.
        </p>

        <div className='theme-container theme-container--light'>
          <div className='styled-avocode-email-tagsinput-container'>
            <h2>Light theme</h2>
            <StyledAvocodeEmailTagsInput
              tags={this.state.tags}
              query={this.state.query}
              onQueryChangeRequest={this._handleQueryChange}
              onTagAddRequest={this._handleTagAdd}
              onTagDeleteRequest={this._handleTagDelete}
            />
          </div>
        </div>
        <div className='theme-container theme-container--dark'>
          <div className='styled-avocode-email-tagsinput-container'>
            <h2 style={{ color: '#fff' }}>Dark theme</h2>
            <StyledAvocodeEmailTagsInput
              theme='dark'
              tags={this.state.tags}
              query={this.state.query}
              onQueryChangeRequest={this._handleQueryChange}
              onTagAddRequest={this._handleTagAdd}
              onTagDeleteRequest={this._handleTagDelete}
            />
          </div>
        </div>
      </div>
    )
  }
}

