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
    tags: [
      { value: 'valid1@email.com' },
      { value: 'valid2@email.com' },
      { value: 'valid3@email.com' },
      { value: 'valid4@email.com' },
      { value: 'valid5@email.com' },
      { value: 'valid6@email.com' },
      { value: 'valid7@email.com' },
      { value: 'valid8@email.com' },
      { value: 'valid9@email.com' },
      { value: 'invalid@email.com', state: 'error' },
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
    const error = new Error('Some error')

    return (
      <div>
        <p>
          If you pass <code>error</code> prop (which can be anything - string, Error object, ...), the input
          is styled. Additionaly, you can add <code>state: error</code> to your tag to add error styling
          to specific email(s).
        </p>

        <div className='theme-container theme-container--light'>
          <div className='styled-avocode-email-tagsinput-container'>
            <h2>Light theme</h2>
            <StyledAvocodeEmailTagsInput
              error={error}
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
              error={error}
              theme='dark'
              tags={this.state.tags}
              query={this.state.query}
              onQueryChangeRequest={this._handleQueryChange}
              onTagAddRequest={this._handleTagAdd}
              onTagDeleteRequest={this._handleTagDelete}
            />
          </div>
        </div>

        <div className='theme-container theme-container--light'>
          <div className='styled-avocode-email-tagsinput-container'>
            <h2>Light theme - non collapsible</h2>
            <StyledAvocodeEmailTagsInput
              collapsible={false}
              error={error}
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
            <h2 style={{ color: '#fff' }}>Dark theme - non collapsible</h2>
            <StyledAvocodeEmailTagsInput
              collapsible={false}
              error={error}
              error={error}
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

