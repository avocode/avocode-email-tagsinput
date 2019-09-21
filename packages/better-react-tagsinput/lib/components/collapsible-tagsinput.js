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
    indices: Array<number>,
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
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

  state = { collapsed: true }

  _input: ?React$ElementRef<*>
  _hiddenTagNodes: Array<HTMLElement> = []
  _tagNodes: HTMLCollection<HTMLElement> | Array<*> = []

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.collapsed !== this.state.collapsed) {
      // HACK: There is some kind of race condition I have
      //       not found yet.
      setTimeout(() => {
        this._scrollToBottom()
      }, 0)
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
    const count = this._hiddenTagNodes.length

    if (this.props.onTagCountUpdateRequest) {
      this.props.onTagCountUpdateRequest(count)
    }
  }

  _updateTagNodeCache() {
    const tagNodes = this._getTagNodes()
    const hiddenTagNodes = this._getNodesWithDifferentOffset(
      tagNodes,
      this.props.offset
    )

    this._hiddenTagNodes = hiddenTagNodes
    this._tagNodes = tagNodes
  }

  _handleBlur = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
  ) => {
    this.setState({ collapsed: true }, () => {
      if (this.props.onBlur) {
        this.props.onBlur(event, editor)
      }
    })
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
  ) => {
    this.setState({ collapsed: false }, () => {
      if (this.props.onFocus) {
        this.props.onFocus(event, editor)
      }
    })
  }

  _handleChange = ({ value, operations }: { value: Value, operations: List<Operation> }) => {
    const tagCountChanged = Boolean(
      operations.find((operation) => {
        return (
          operation.type === 'insert_node' ||
          operation.type === 'remove_node'
        ) || (
          operation.node &&
          operation.node.type === TAG_PLUGIN_NODE_ID
        )
      })
    )

    if (tagCountChanged) {
      this._updateTagNodeCache()
      this._countTags()
      this._scrollToBottom()
    }
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
    const lastNodeOffsetTop = nodes[nodes.length - 1] && nodes[nodes.length - 1].offsetTop || 0
    const offsetTop = Number.isFinite(offset) || lastNodeOffsetTop

    return Array.from(nodes).filter((node) => {
      return node.offsetTop !== offsetTop
    })
  }

  _handleInitialLoad = () => {
    this._updateTagNodeCache()
    this._countTags()
    this._scrollToBottom()
  }

  _scrollToBottom = () => {
    const lastTagNode = this._tagNodes[this._tagNodes.length - 1]

    if (!lastTagNode) {
      return
    }

    lastTagNode.scrollIntoView()
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
          onChange={this._handleChange}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          onQueryChangedRequest={this.props.onQueryChangedRequest}
          onTagAddedRequest={this.props.onTagAddedRequest}
          onTagDeleteRequest={this.props.onTagDeleteRequest}
          setRef={this._setRef}
          onInitialLoad={this._handleInitialLoad}
        />
      </div>
    )
  }
}
