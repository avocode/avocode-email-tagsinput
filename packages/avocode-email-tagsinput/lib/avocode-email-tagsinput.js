// @flow

import React from 'react'
import TagsInput, { CollapsibleTagsInput } from '@avocode/better-react-tagsinput'
import classNames from 'classnames'
import * as utils from './utils'
import Counter from './components/counter'
import EmailTag from './components/email-tag'

import type { Name, Query, Tags, TagComponentProps } from '@avocode/better-react-tagsinput/dist/types'
import type { Editor } from 'slate-react'

// $FlowFixMe: Ignore flow for styles
import '../styles/index.css'

type Props = {
  tags: Tags,
  query: Query,
  name: Name,
  unique: boolean,
  collapsible: boolean,
  renderCounter?: (attributes: { focused: boolean, tagCount: number }) => React$Node,
  onQueryChangedRequest?: (query: Query) => void,
  onTagAddedRequest?: (query: Query, event: SyntheticKeyboardEvent<*>) => void,
  onTagDeleteRequest?: (
    indices: Array<number>,
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
  ) => void,
  onPasteRequest?: ?(event: SyntheticClipboardEvent<*>) => void,
  onBlur?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
  ) => void,
  onFocus?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
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

  static displayName = 'AvocodeEmailTagsInput'

  state = {
    query: this.props.query,
    tags: this._getTags(this.props.tags),
    tagCount: 0,
    focused: false,
  }

  _input: ?Editor

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.query !== nextProps.query ||
      this.props.tags !== nextProps.tags
    ) {
      this.setState({
        query: nextProps.query,
        tags: nextProps.tags,
      })
    }
  }


  _getTags(tags: Tags): Tags {
    const validTags = tags.filter((tag) => {
      return utils.isValueValidEmail(tag.value)
    })

    return this.props.unique ?
      utils.getUniqueTagsByValue(validTags) :
      validTags
  }

  _handleAddTag = (text: Query, event: SyntheticKeyboardEvent<*>) => {
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
        this.props.onTagAddedRequest(text, event)
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
    }, () => {
      if (this.props.onTagDeleteRequest) {
        this.props.onTagDeleteRequest(indices, event)
      }
    })
  }

  _handleTagCountUpdate = (count: number) => {
    this.setState({ tagCount: count })
  }

  _handleBlur = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
  ) => {
    this.setState({ focused: false })
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
  ) => {
    this.setState({ focused: true })
  }

  _handleInputClick = () => {
    if (this._input) {
      this._input.focus()
    }
  }

  _renderEmailTag = (props: TagComponentProps) => {
    return <EmailTag {...props} />
  }

  render() {
    const { focused, tagCount } = this.state

    const counterComponent = this.props.renderCounter ?
      this.props.renderCounter({ focused, tagCount }) :
      (!focused && tagCount > 0 && 
        <Counter
          name={this.props.name}
          count={tagCount}
          onClick={this._handleInputClick}
        />
      )

    if (this.props.collapsible) {
      return (
        <div className={classNames('avocode-email-tagsinput-collapsible', {
            [`avocode-email-tagsinput-collapsible--${this.props.name}`]: this.props.name,
            [`avocode-email-tagsinput-collapsible--focused`]: focused,
            [`avocode-email-tagsinput-collapsible--${this.props.name}--focused`]: this.props.name && focused,
          })}
          onClick={this._handleInputClick}
        >
          <CollapsibleTagsInput
            {...this.props}
            name={this.props.name}
            query={this.state.query}
            tags={this.state.tags}
            tagComponentFactory={this._renderEmailTag}
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
      <div className={classNames('avocode-email-tagsinput', {
        [`avocode-email-tagsinput--${this.props.name}`]: this.props.name,
        [`avocode-email-tagsinput--focused`]: focused,
        [`avocode-email-tagsinput--${this.props.name}--focused`]: this.props.name && focused,
      })}
      >
        <TagsInput
          {...this.props}
          name={this.props.name}
          query={this.state.query}
          tags={this.state.tags}
          tagComponentFactory={this._renderEmailTag}
          onQueryChangedRequest={this._handleQueryChange}
          onTagAddedRequest={this._handleAddTag}
          onTagDeleteRequest={this._handleDeleteTag}
          onPasteRequest={this.props.onPasteRequest}
          onFocus={this._handleFocus}
          onBlur={this._handleBlur}
        />
      </div>
    )
  }
}

export {
  utils,
}
