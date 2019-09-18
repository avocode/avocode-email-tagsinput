// @flow

import React from 'react'
import { Text } from 'slate'
import { Editor } from 'slate-react'
import classNames from 'classnames'
import { createPlugins } from '../plugins'
import schema from '../schema'
import { parseValue } from '../utils'
import initialValue from '../initial-value'

import type { List } from 'immutable'
import type { Operation, Value } from 'slate'

import '../../styles/index.css'

import type {
  AddTagKeyCodes,
  KeyCode,
  Plugin,
  Query,
  Tag,
  TagComponentFactory,
  Tags,
} from '../types.js'

export type Props = {
  query: string,
  tags: Tags,
  name: string,
  addTagKeyCodes: AddTagKeyCodes,
  plugins?: Array<Plugin>,
  tagComponentFactory?: TagComponentFactory,
  onQueryChangedRequest: (query: Query) => void,
  onTagAddedRequest: (text: Query, event: SyntheticKeyboardEvent<*>) => void,
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
  focused: boolean,
}


export default class TagsInput extends React.PureComponent<Props, State> {
  state = {
    value: initialValue,
    plugins: [],
    focused: false,
  }


  static defaultProps = {
    name: '',
    addTagKeyCodes: [ 32 /* Space */, 13 /* Enter */, 188 /* Comma */ ],
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
      onTagDeleteRequest,
      onPasteRequest,
      onTagDeleteRequest: this._handleDeleteTag,
      onTagAddedRequest: this._handleAddTag,
    })

    const value = parseValue(tags, query, this.state.value ? this.state.value.selection : null)

    this.setState({
      plugins,
      value,
    }, () => {
      if (this.props.onInitialLoad) {
        this.props.onInitialLoad()
      }
    })
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.query !== nextProps.query ||
      this.props.tags !== nextProps.tags
    ) {
      const nextValue = parseValue(nextProps.tags, nextProps.query, this.state.value.selection)
      this.setState({
        value: nextValue,
      })
    }
  }

  _handleChange = ({ value, operations }: { value: Value, operations: List<Operation> }) => {
    this.setState({ value }, () => {
      const { selection } = value
      // NOTE: Capturing the end of selection because if CTRL/CMD+A
      //       selects the whole document we actually care about text
      //       value of the "query" part of the input which is at the end
      const currentNode = value.document.getNode(selection.end.key)

      const textOperation = Boolean(
        (
          operations.size === 1 &&
          operations.find((operation) => operation.type === 'insert_text')
        ) ||
        (
          operations.size === 2 &&
          operations.find((operation) => operation.type === 'remove_text')
        )
      )

      if (currentNode && textOperation) {
        this.props.onQueryChangedRequest(currentNode.text)
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
      this.props.onQueryChangedRequest(queryNodeText || '')
    }
  }

  _handleAddTag = (text: Query, event: SyntheticKeyboardEvent<*>) => {
    this.props.onTagAddedRequest(text, event)
  }

  _handleOnClick = (
    event: SyntheticMouseEvent<*>,
    editor: Editor,
    next: Function
  ) => {
    const key = editor.value.selection.start.key
    const node = editor.value.document.getNode(key)

    if (node instanceof Text && node.text.length === 0) {
      event.preventDefault()

      editor.moveToEndOfDocument().focus()

      next()
      return
    }

    next()
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

  render() {
    const isFocused = this.state.value.selection.isFocused

    return (
      <div
        className={classNames('tagsinput', {
          [`tagsinput--${this.props.name}`]: this.props.name,
          'tagsinput--focused': isFocused,
          [`tagsinput--${this.props.name}--focused`]: isFocused && this.props.name,
        })}
      >
        <Editor
          {...this.props}
          value={this.state.value}
          plugins={this.state.plugins}
          schema={schema}
          onChange={this._handleChange}
          onBlur={this._handleBlur}
          onFocus={this._handleFocus}
          ref={this.props.setRef}
          onClick={this._handleOnClick}
        />
      </div>
    )
  }
}
