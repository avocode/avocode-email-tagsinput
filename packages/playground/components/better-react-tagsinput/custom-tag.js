// @flow

import React from 'react'
import TagsInput, { utils } from '@avocode/better-react-tagsinput'
import classNames from 'classnames'

import type { Editor } from 'slate-react'
import type { Name, Query, Tags, TagComponentProps } from '@avocode/better-react-tagsinput/dist/types'

type State = {
  query: Query,
  tags: Tags,
}

class MyCustomTag extends React.PureComponent<TagComponentProps> {
  _handleOnRemoveButtonClick = (event: SyntheticMouseEvent<*>) => {
    this.props.onRemoveButtonClick(event, this.props.id)
  }

  _handleOnMouseDown = (event: SyntheticMouseEvent<*>) => {
    // NOTE: We need to prevent blur event from hapenning when this component
    //       is rendered in CollapsibleTagsInput
    event.preventDefault()
  }

  render() {
    const { isFocused, name, contents, state, onRemoveButtonClick, ...attributes } = this.props

    return (
      <span {...attributes}
        className={classNames('my-custom-tag', {
          'my-custom-tag--focused': isFocused,
          [`my-custom-tag--${state}`]: Boolean(state),
        })}
        onMouseDown={this._handleOnMouseDown}
        onClick={this._handleOnRemoveButtonClick}
      >
        {this.props.contents}
        {this.props.children}
      </span>
    )
  }
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

  render() {
    return (
      <div>
        <p>
          By passing <code>tagComponentFactory</code> you can render your own React component for
          tag items.
          The props is a render prop that receives <code>props</code> object. See source code for this page (or the library default component) on how these props should be applied.
        </p>

        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{this.state.tags.map(t => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{this.state.query}</dd>
        </dl>

        <TagsInput
          tags={this.state.tags}
          query={this.state.query}
          tagComponentFactory={(props) => (
            <MyCustomTag {...props} />
          )}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleTagAdded}
          onTagDeleteRequest={this._handleTagDeleted}
        />
      </div>
    )
  }
}

