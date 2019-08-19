// @flow

import React from 'react'
import TagsInput, { CollapsibleTagsInput } from 'better-react-tagsinput'
import classNames from 'classnames'
import * as utils from './utils'
import Counter from './components/counter'

import type { Name, Query, Tags } from 'better-react-tagsinput'
import type { Editor } from 'slate-react'

import '../styles/index.css'

type Props = {
  tags: Tags,
  query: Query,
  name: Name,
  unique: boolean,
  collapsible: boolean,
  renderCounter?: (attributes: { focused: boolean, tagCount: number }) => React$Node,
  onQueryChangedRequest?: (query: Query) => void,
  onTagAddedRequest?: (event: SyntheticKeyboardEvent<*>, query: Query) => void,
  onTagDeleteRequest?: (event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>, indices: Array<number>) => void,
  onPasteRequest?: ?(event: SyntheticClipboardEvent<*>) => void,
  onBlur?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function,
  ) => void,
  onFocus?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function,
  ) => void,
}

type State = {
  tags: Tags,
  query: Query,
  tagCount: number,
  focused: boolean,
}

export default class AvocodeEmailTagsInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    unique: false,
    collapsible: false,
    query: '',
    name: '',
    tags: [],
  }

  state = {
    query: this.props.query,
    tags: this._getTags(this.props.tags),
    tagCount: 0,
    focused: false,
  }

  _input: ?Editor

  componentWillReceiveProps(nextProps: Props) {
    let nextState = {}

    if (this.props.query !== nextProps.query) {
      nextState = { ...nextState, query: nextProps.query }
    }

    if (this.props.tags !== nextProps.tags) {
      nextState = { ...nextState, tags: this._getTags(nextProps.tags) }
    }

    this.setState(nextState)
  }

  _getTags(tags: Tags): Tags {
    const validTags = tags.filter((tag) => {
      return utils.isValueValidEmail(tag.value)
    })

    return this.props.unique ?
      utils.getUniqueTagsByValue(validTags) :
      validTags
  }

  _handleAddTag = (event: SyntheticKeyboardEvent<*>, text: Query) => {
    if (!utils.isValueValidEmail(text)) {
      return
    }

    this.setState((prevState) => {
      const nextTags = [ ...prevState.tags, { value: text } ]
      const tags = this.props.unique ? utils.getUniqueTagsByValue(nextTags) : nextTags

      return {
        tags,
        query: '',
      }
    }, () => {
      if (this.props.onTagAddedRequest) {
        this.props.onTagAddedRequest(event, text)
      }
    })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({ query }, () => {
      if (this.props.onQueryChangedRequest) {
        this.props.onQueryChangedRequest(query)
      }
    })
  }

  _handleDeleteTag = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    indices: Array<number>
  ) => {
    this.setState((prevState) => {
      const nextTags = utils.removeTagsByIndices(
        prevState.tags,
        indices
      )

      return {
        tags: nextTags,
      }
    }, () => {
      if (this.props.onTagDeleteRequest) {
        this.props.onTagDeleteRequest(event, indices)
      }
    })
  }

  _handleTagCountUpdate = (count: number) => {
    this.setState({ tagCount: count })
  }

  _handleBlur = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    this.setState({ focused: false })
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    this.setState({ focused: true })
  }

  _handleCounterClick = () => {
    if (this._input) {
      this._input.focus()
    }
  }

  render() {
    const { focused, tagCount } = this.state

    const counterComponent = this.props.renderCounter ?
      this.props.renderCounter({ focused, tagCount }) :
      (!focused && tagCount > 0 && 
        <Counter
          name={this.props.name}
          count={tagCount}
          onClick={this._handleCounterClick}
        />
      )

    if (this.props.collapsible) {
      return (
        <div className={classNames('avocode-tags-input-collapsible', {
          [`avocode-tags-input-collapsible--${this.props.name}`]: this.props.name,
        })}
        >
          <CollapsibleTagsInput
            {...this.props}
            name={this.props.name}
            query={this.state.query}
            tags={this.state.tags}
            onQueryChangedRequest={this._handleQueryChange}
            onTagAddedRequest={this._handleAddTag}
            onTagDeleteRequest={this._handleDeleteTag}
            onPasteRequest={this.props.onPasteRequest}
            onTagCountUpdateRequest={this._handleTagCountUpdate}
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            setRef={(node) => {
              if (node) {
                this._input = node
              }
            }}
          />
          {counterComponent}
        </div>
      )
    }

    return (
      <TagsInput
        {...this.props}
        name={this.props.name}
        query={this.state.query}
        tags={this.state.tags}
        onQueryChangedRequest={this._handleQueryChange}
        onTagAddedRequest={this._handleAddTag}
        onTagDeleteRequest={this._handleDeleteTag}
        onPasteRequest={this.props.onPasteRequest}
      />
    )
  }
}

export {
  utils,
}
