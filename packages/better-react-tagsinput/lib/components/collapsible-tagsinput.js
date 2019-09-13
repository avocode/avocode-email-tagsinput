// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import TagsInput from './tagsinput'
import { TAG_PLUGIN_NODE_ID } from '../plugins/tags'

import type { Editor } from 'slate'
import type { Props as TagsInputProps } from './tagsinput'
import type { AddTagKeyCodes, Query } from '../types.js'

type Props = TagsInputProps & {
  addTagKeyCodes?: AddTagKeyCodes,
  offset?: number,
  onQueryChangedRequest: (query: Query) => void,
  onTagAddedRequest: (text: Query, event: SyntheticKeyboardEvent<*>) => void,
  onTagDeleteRequest: (
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    indices: Array<number>,
  ) => void,
  onTagCountUpdateRequest?: ?(count: number) => void,
  setRef?: ?(node: ?React$ElementRef<*>) => mixed,
}

type State = {
  collapsed: boolean,
}

export default class CollapsibleTagsInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    name: '',
    addTagKeyCodes: [ 32 /* Space */, 13 /* Enter */, 188 /* Comma */ ],
  }

  state = { collapsed: false }

  _input: ?React$ElementRef<*>

  componentWillReceiveProps(nextProps: Props) {
    // NOTE: Should update counter if external changes
    //       are triggered but only in collapsed state
    if (
      !this.state.collapsed &&
      this.props.tags.length !== nextProps.tags.length
    ) {
      this._countTags()
    }
  }

  _setRef = (node: ?React$ElementRef<*>) => {
    if (!node) {
      return null
    }

    this._input = node

    if (this.props.setRef) {
      this.props.setRef(node)
    }
  }

  _countTags = () => {
    const tagNodes = this._getTagNodes()
    const hiddenTagNodes = this._getNodesWithDifferentOffset(
      tagNodes,
      this.props.offset
    )
    const count = hiddenTagNodes.length

    if (this.props.onTagCountUpdateRequest) {
      this.props.onTagCountUpdateRequest(count)
    }
  }

  _handleBlur = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    if (!this.props.onBlur) {
      next()
    }

    this._countTags()

    this.setState({ collapsed: true }, () => {
      this._scrollToTop()

      if (this.props.onBlur) {
        this.props.onBlur(event, editor, next)
      }
    })
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    if (!this.props.onFocus) {
      next()
    }

    this._countTags()

    this.setState({ collapsed: false }, () => {
      this._scrollToBottom()

      if (this.props.onFocus) {
        this.props.onFocus(event, editor, next)
      }
    })
  }

  _getTagNodes(): HTMLCollection<HTMLElement> | Array<*> {
    try {
      const editorNode = this._input ? ReactDOM.findDOMNode(this._input) : null
      if (!editorNode) {
        console.warn('CollapsibleTagsInput#_getTagNodes -> Editor node not found')
        return []
      }

      if (!(editorNode instanceof Element)) {
        return []
      }

      return editorNode.getElementsByClassName(TAG_PLUGIN_NODE_ID)
    } catch (err) {
      console.warn(err)
      return []
    }
  }

  _getNodesWithDifferentOffset(
    nodes: HTMLCollection<HTMLElement> | Array<*>,
    offset: ?number,
  ): Array<HTMLElement> {
    const firstNodeOffsetTop = nodes[0] && nodes[0].offsetTop || 0
    const offsetTop = Number.isFinite(offset) || firstNodeOffsetTop

    return Array.from(nodes).filter((node) => {
      return node.offsetTop !== offsetTop
    })
  }

  _scrollToTop = () => {
    const editorNode = this._input ? ReactDOM.findDOMNode(this._input) : null

    if (!editorNode || !(editorNode instanceof Element)) {
      return
    }

    editorNode.scrollIntoView()
  }

  _scrollToBottom = () => {
    const tagNodes = this._getTagNodes()
    const hiddenTagNodes = this._getNodesWithDifferentOffset(
      tagNodes,
      this.props.offset
    )
    const lastHiddenTagNode = hiddenTagNodes[hiddenTagNodes.length - 1]

    if (!lastHiddenTagNode) {
      return
    }

    lastHiddenTagNode.scrollIntoView()
  }

  render() {
    return (
      <div className={classNames('collapsible-tagsinput', {
          [`collapsible-tagsinput--${this.props.name}`]: this.props.name,
          'collapsible-tagsinput--collapsed': this.state.collapsed,
          [`collapsible-tagsinput--${this.props.name}--collapsed`]: this.state.collapsed,
        })}
      >
        <TagsInput
          {...this.props}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          onQueryChangedRequest={this.props.onQueryChangedRequest}
          onTagAddedRequest={this.props.onTagAddedRequest}
          onTagDeleteRequest={this.props.onTagDeleteRequest}
          setRef={this._setRef}
          onInitialLoad={this._countTags}
        />
      </div>
    )
  }
}
