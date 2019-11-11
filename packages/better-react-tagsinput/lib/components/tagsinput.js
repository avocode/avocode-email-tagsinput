// @flow

import React from 'react'
import { Text } from 'slate'
import { Editor } from 'slate-react'
import classNames from 'classnames'
import { createPlugins } from '../plugins'
import schema from '../schema'
import initialValueFactory from '../initial-value-factory'

import type { List } from 'immutable'
import type { Operation, Value } from 'slate'

// $FlowFixMe: Ignore flow for styles
import '../../styles/index.css'

import type {
  AddTagKeyCodes,
  Plugin,
  Query,
  TagComponentFactory,
  Tags,
} from '../types'

export type Props = {
  query: string,
  tags: Tags,
  name: string,
  offset?: number,
  addTagKeyCodes: AddTagKeyCodes,
  plugins?: Array<Plugin>,
  tagComponentFactory?: TagComponentFactory,
  onQueryChangeRequest: (query: Query) => void,
  onTagAddRequest: (text: Query, event: SyntheticKeyboardEvent<*>) => void,
  onTagCountUpdateRequest?: ?(count: number) => void,
  onTagDeleteRequest: (
    indices: Array<number>,
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
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
  onChange?: ?({ value: Value, operations: List<Operation> }) => void,
  setRef?: ?(node: ?React$ElementRef<*>) => mixed,
  onInitialLoad?: ?() => void,
}

export type State = {
  value: Value,
  plugins: Array<Plugin>,
}


export default class TagsInput extends React.PureComponent<Props, State> {
  static defaultProps = {
    name: '',
    addTagKeyCodes: [ 32 /* Space */, 13 /* Enter */, 188 /* Comma */ ],
  }

  static displayName = 'TagsInput'

  state = {
    value: initialValueFactory(),
    plugins: [],
  }

  componentDidMount() {
    const {
      addTagKeyCodes,
      name,
      tagComponentFactory,
      tags,
      query,
      onTagDeleteRequest,
      onPasteRequest,
    } = this.props
    const plugins = this.props.plugins || createPlugins({
      addTagKeyCodes,
      name,
      tagComponentFactory,
      onPasteRequest,
      onTagDeleteRequest: this._handleDeleteTag,
      onTagAddRequest: this._handleAddTag,
    })

    this.setState({ plugins }, () => {
      if (this._input) {
        this._input.createValue({
          tags: this.props.tags,
          query: this.props.query,
        })
      }
      if (this.props.onInitialLoad) {
        this.props.onInitialLoad()
      }
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this._input && (
        this.props.tags !== nextProps.tags ||
        this.props.query !== nextProps.query
      )
    ) {
      this._input.updateValue({
        tags: nextProps.tags,
        prevTags: this.props.tags,
        query: nextProps.query,
        prevQuery: this.props.query,
      })
    }
  }

  _input: React$ElementRef<*> = null

  _handleChange = ({ value, operations }: { value: Value, operations: List<Operation> }) => {
    this.setState({ value }, () => {
      const { selection } = value
      // NOTE: Capturing the end of selection because if CTRL/CMD+A
      //       selects the whole document we actually care about text
      //       value of the "query" part of the input which is at the end
      const currentNode = value.document.getNode(selection.end.key)

      const allowedTextOperations = operations.reduce((desc, operation) => {
        let nextDesc = desc

        if (!nextDesc.insertText && operation.type === 'insert_text') {
          nextDesc = { ...nextDesc, insertText: true }
        }

        if (!nextDesc.removeText && operation.type === 'remove_text') {
          nextDesc = { ...nextDesc, removeText: true }
        }

        return nextDesc
      }, {
        insertText: false,
        removeText: false,
      })

      if (
        currentNode &&
        (allowedTextOperations.insertText || allowedTextOperations.removeText)
      ) {
        this.props.onQueryChangeRequest(currentNode.text)
      }

      if (this.props.onChange) {
        this.props.onChange({ value, operations })
      }
    })
  }

  _handleDeleteTag = (
    indices: Array<number>,
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    queryNodeText?: Query,
  ) => {
    this.props.onTagDeleteRequest(indices, event)

    if (this.props.query !== queryNodeText) {
      this.props.onQueryChangeRequest(queryNodeText || '')
    }
  }

  _handleAddTag = (text: Query, event: SyntheticKeyboardEvent<*>) => {
    this.props.onTagAddRequest(text, event)
  }

  _handleBlur = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    next()

    if (this.props.onBlur) {
      this.props.onBlur(event, editor)
    }
  }

  _handleFocus = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    next()

    if (this.props.onFocus) {
      this.props.onFocus(event, editor)
    }
  }

  _setRef = (node: React$ElementRef<*>) => {
    if (!node) {
      return
    }

    this._input = node

    if (this.props.setRef) {
      this.props.setRef(node)
    }
  }

  render() {
    const value = this._input ? this._input.value : this.state.value
    const isFocused = value.selection.isFocused

    // NOTE: Do not pass library specific props
    //       to Slate editor to avoid errors
    const {
      query,
      tags,
      name,
      offset,
      addTagKeyCodes,
      plugins,
      tagComponentFactory,
      onQueryChangeRequest,
      onTagAddRequest,
      onTagCountUpdateRequest,
      onTagDeleteRequest,
      onPasteRequest,
      setRef,
      onInitialLoad,
      ...restProps
    } = this.props

    return (
      <div
        className={classNames('tagsinput', {
          [`tagsinput--${this.props.name}`]: this.props.name,
          'tagsinput--focused': isFocused,
          [`tagsinput--${this.props.name}--focused`]: isFocused && this.props.name,
        })}
      >
        <Editor
          {...restProps}
          ref={this._setRef}
          value={value}
          plugins={this.state.plugins}
          schema={schema}
          onBlur={this._handleBlur}
          onChange={this._handleChange}
          onFocus={this._handleFocus}
        />
      </div>
    )
  }
}

