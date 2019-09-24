// @flow

import React from 'react'
import uuid from 'uuid'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'
import StateView from '../state-view'

import type { Query, Tags } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
  amount: number,
}

type Props = {
  amount: number,
}

const createRandomTags = (amount: number): Tags => {
  return Array.from(new Array(amount)).map((item) => {
    return {
      value: uuid.v4().substr(0, Math.ceil(Math.random() * 15)),
      state: uuid.v4().substr(0, Math.ceil(Math.random() * 8)),
    }
  })
}

export default class Performance extends React.PureComponent<Props, State> {
  static defaultProps = {
    amount: 150,
  }

  state = {
    query: '',
    tags: createRandomTags(this.props.amount),
    amount: this.props.amount,
  }


  componentWillReceiveProps(nextProps: Props) {
    if (this.props.amount !== nextProps.amount) {
      this.setState({ tags: createRandomTags(nextProps.amount) })
    }
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

  _changeAmount = (proxy: SyntheticInputEvent<*>) => {
    const amount = Number(proxy.target.value)

    this.setState({ amount })
  }

  _regenerateTags = () => {
    this.setState({
      tags: createRandomTags(this.state.amount),
    })
  }

  render() {
    return (
      <div>
        <p>
          Test here for performance.
          <br />
          <input
            value={this.state.amount}
            type='number'
            onChange={this._changeAmount}
          />
          <br />
          <button onClick={this._regenerateTags}>Generate tags</button>
        </p>

        <StateView tags={this.state.tags} query={this.state.query} />

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
