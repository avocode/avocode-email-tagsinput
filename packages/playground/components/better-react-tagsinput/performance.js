// @flow
import React from 'react'
import uuid from 'uuid'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

const createRandomTags = (amount) => {
  return Array.from(new Array(amount)).map((item) => {
    return {
      value: uuid.v4().substr(0, Math.ceil(Math.random() * 15)),
      state: uuid.v4().substr(0, Math.ceil(Math.random() * 8)),
    }
  })
}

export default class Performance extends React.PureComponent<{}, State> {
  state = {
    query: '',
    tags: createRandomTags(this.props.amount),
    amount: this.props.amount,
  }

  static defaultProps = {
    amount: 150
  }

  _handleQueryChange = (query: Query) => {
    this.setState({
      query,
    })
  }

  _handleTagAdded = (
    text: Query,
    event: SyntheticKeyboardEvent<*>
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

  _changeAmount = (proxy) => {
    const amount = Number(proxy.target.value)

    this.setState({ amount })
  }

  _regenerateTags = () => {
    this.setState({
      tags: createRandomTags(this.state.amount)
    })
  }

  render() {
    return (
      <div>
        <p>
          Test here for performance.
          <br />
          <input onChange={this._changeAmount} type='number' value={this.state.amount} />
          <br />
          <button onClick={this._regenerateTags}>Generate tags</button>
        </p>

        <TagsInput
          tags={this.state.tags}
          query={this.state.query}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}
