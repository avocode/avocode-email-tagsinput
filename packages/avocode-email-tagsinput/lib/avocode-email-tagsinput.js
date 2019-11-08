// @flow

import React from 'react'
import TagsInput, { CollapsibleTagsInput } from '@avocode/better-react-tagsinput'
import classNames from 'classnames'
import * as utils from './utils'
import Counter from './components/counter'
import EmailTag from './components/email-tag'

import type { Name, Query, Tags, TagComponentProps } from '@avocode/better-react-tagsinput/dist/types'

// $FlowFixMe: Ignore flow for styles
import '../styles/index.css'

type Props = {
  tags: Tags,
  query: Query,
  name: Name,
  unique: boolean,
  collapsible: boolean,
  renderCounter?: (attributes: { focused: boolean, tagCount: number }) => React$Node,
  submitKeyCodes: Array<number>,
  onSubmitRequest?: ?(event: SyntheticKeyboardEvent<*>) => void,
  onQueryChangeRequest?: (query: Query) => void,
  onTagAddRequest?: (query: Query, event: SyntheticKeyboardEvent<*>) => void,
  onTagDeleteRequest?: (
    indices: Array<number>,
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
  ) => void,
  onPasteRequest?: ?(event: SyntheticClipboardEvent<*>) => void,
  onBlur?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    // $FlowFixMe: Dependency not provided, will be fixed in future releases.
    editor,
  ) => void,
  onFocus?: ?(
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    // $FlowFixMe: Dependency not provided, will be fixed in future releases.
    editor,
  ) => void,
}

type State = {
  tags: Tags,
  query: Query,
  tagCount: number,
  focused: boolean,
}

const ENTER_KEYCODE = 13

/* eslint-disable-next-line react-props-in-state/rules */ // "react-props-in-state" does not recognize UNSAFE
export default class AvocodeEmailTagsInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    unique: false,
    collapsible: false,
    query: '',
    name: '',
    tags: [],
    submitKeyCodes: [ ENTER_KEYCODE ],
  }

  static displayName = 'AvocodeEmailTagsInput'

  state = {
    query: this.props.query,
    tags: this._getTags(this.props.tags, this.props.unique),
    tagCount: 0,
    focused: false,
  }

  // $FlowFixMe: Ignoring for now, defs not present in
  //             flowtyped & its causing type checker to
  //             fail when consumed by 3rd party
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.query !== nextProps.query ||
      this.props.tags !== nextProps.tags
    ) {
      this.setState({
        query: nextProps.query,
        tags: this._getTags(nextProps.tags, nextProps.unique),
      })
    }
  }

  _input = null

  _getTags(tags: Tags, unique: boolean = false): Tags {
    const validTags = tags.filter((tag) => {
      return utils.isValueValidEmail(tag.value)
    })

    return unique ?
      utils.getUniqueTagsByValue(validTags) :
      validTags
  }

  _handleAddTag = (text: Query, event: SyntheticKeyboardEvent<*>) => {
    const { onSubmitRequest } = this.props

    if (!utils.isValueValidEmail(text)) {
      // NOTE: Submission callback is only triggered
      //       if submission key was pressed and query
      //       is empty (to avoid submitting incomplete
      //       emails etc)
      if (
        onSubmitRequest &&
        this.props.submitKeyCodes.includes(event.keyCode) &&
        !this.props.query
      ) {
        onSubmitRequest(event)
      }
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
      if (this.props.onTagAddRequest) {
        this.props.onTagAddRequest(text, event)
      }
    })
  }

  _handleQueryChange = (query: Query) => {
    this.setState({ query }, () => {
      if (this.props.onQueryChangeRequest) {
        this.props.onQueryChangeRequest(query)
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
    // $FlowFixMe: Dependency not provided, will be fixed in future releases.
    editor,
  ) => {
    this.setState({ focused: false })
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    // $FlowFixMe: Dependency not provided, will be fixed in future releases.
    editor,
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

    // NOTE: Remove properties not belonging to
    //       `TagsInput` & `CollapsibleTagsInput`
    //       components to avoid errors
    const {
      collapsible,
      unique,
      renderCounter,
      onSubmitRequest,
      submitKeyCodes,
      ...restProps
    } = this.props

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
        <div
          className={classNames('avocode-email-tagsinput-collapsible', {
            [`avocode-email-tagsinput-collapsible--${this.props.name}`]: this.props.name,
            'avocode-email-tagsinput-collapsible--focused': focused,
            [`avocode-email-tagsinput-collapsible--${this.props.name}--focused`]: this.props.name && focused,
          })}
          onClick={this._handleInputClick}
        >
          <CollapsibleTagsInput
            {...restProps}
            name={this.props.name}
            query={this.state.query}
            setRef={(node) => {
              if (node) {
                this._input = node
              }
            }}
            tags={this.state.tags}
            tagComponentFactory={this._renderEmailTag}
            onBlur={this._handleBlur}
            onFocus={this._handleFocus}
            onPasteRequest={this.props.onPasteRequest}
            onQueryChangeRequest={this._handleQueryChange}
            onTagAddRequest={this._handleAddTag}
            onTagCountUpdateRequest={this._handleTagCountUpdate}
            onTagDeleteRequest={this._handleDeleteTag}
          />
          {counterComponent}
        </div>
      )
    }

    return (
      <div className={classNames('avocode-email-tagsinput', {
        [`avocode-email-tagsinput--${this.props.name}`]: this.props.name,
        'avocode-email-tagsinput--focused': focused,
        [`avocode-email-tagsinput--${this.props.name}--focused`]: this.props.name && focused,
      })}
      >
        <TagsInput
          {...restProps}
          name={this.props.name}
          query={this.state.query}
          tags={this.state.tags}
          tagComponentFactory={this._renderEmailTag}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          onPasteRequest={this.props.onPasteRequest}
          onQueryChangeRequest={this._handleQueryChange}
          onTagAddRequest={this._handleAddTag}
          onTagDeleteRequest={this._handleDeleteTag}
        />
      </div>
    )
  }
}

export {
  utils,
}

