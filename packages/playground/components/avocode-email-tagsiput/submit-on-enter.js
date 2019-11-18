// @flow

import React from 'react'
import AvocodeEmailTagsInput, { utils } from '@avocode/avocode-email-tagsinput'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
  submittedEmails: string,
  disabled: boolean,
}

const initialTags = [ { value: 'hello@world.com' }, { value: 'bye@world.com' } ]
const initialQuery = 'you@test.com'

export default class SubmitOnEnter extends React.PureComponent<{}, State> {
  state = {
    query: initialQuery,
    tags: initialTags,
    submittedEmails: '',
    ...this._getInputValidity(initialTags, initialQuery),
  }

  _handleQueryChange = (query: Query) => {
    this.setState((prevState) => {
      return {
        query,
        ...this._getInputValidity(prevState.tags, query),
      }
    })
  }

  _handleTagAdded = (
    text: Query,
  ) => {
    this.setState((prevState) => {
      const tags = [ ...prevState.tags, { value: text } ]
      const query = ''
      return {
        tags,
        query,
        ...this._getInputValidity(tags, query),
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

  _getInputValidity(tags: Tags, query: Query) {
    const emailQueryValid = utils.isValueValidEmail(query)

    return {
      disabled: (
        tags.length < 1 ||
        (query.length > 0 && !emailQueryValid)
      ),
    }
  }

  _handleSubmitButton = () => {
    this._fakeSubmit()
  }

  _fakeSubmit = () => {
    this.setState((prevState) => {
      const submittedEmails = [
        ...prevState.tags,
        { value: prevState.query },
      ].filter((t) => t.value)
        .map((t) => t.value)
      .join(' ')

      return {
        tags: [],
        query: '',
        disabled: true,
        submittedEmails,
      }
    })
  }

  render() {
    return (
      <div>
        <StateView tags={this.state.tags} query={this.state.query} />
        <p>
          Email submissions:<br />
          {this.state.submittedEmails || ' '}
        </p>

        <p>
          Hitting ENTER will submit the input and clear the input if there
          are any valid email tags.
        </p>

        <p>
          Submit button can also submit valid emails if they aren't tags.
        </p>

        <AvocodeEmailTagsInput
          tags={this.state.tags}
          query={this.state.query}
          onQueryChangeRequest={this._handleQueryChange}
          onSubmitRequest={this._fakeSubmit}
          onTagAddRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
        <br />
        <button
          disabled={this.state.disabled}
          onClick={this._handleSubmitButton}
        >
          Submit
        </button>
      </div>
    )
  }
}

