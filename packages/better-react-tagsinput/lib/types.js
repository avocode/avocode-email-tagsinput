// @flow

import { Editor } from 'slate-react'

export type Query = string
export type Tag = {|
  value: string,
  state?: string | number,
  data?: Object,
|}
export type Tags = Array<Tag>

export type Plugin = {
  onKeyDown?: Function,
  renderNode?: Function,
  commands?: Object,
}

export interface PluginFactory {
  renderNode?: (props: Object, editor: Editor, next: Function) => ?React$Node;
  onKeyDown?: (event: SyntheticKeyboardEvent<*>, editor: Editor, next: Function) => void;
  initialize(): Plugin;
}

export type KeyCode = number
export type AddTagKeyCodes = Array<KeyCode>
export type Name = string

export type TagComponentProps = {
  isFocused: boolean,
  id: string,
  name: Name,
  defaultName: Name,
  contents: Query,
  state: string,
  title: string,
  children?: React$Node,
  data: Object,
  onRemoveButtonClick: (event: SyntheticMouseEvent<*>, id: string) => void,
}

export type TagComponentFactory = (props: TagComponentProps) => React$Node

export type FactoryPluginOptions = {
  addTagKeyCodes: AddTagKeyCodes,
  name: Name,
  tagComponentFactory?: TagComponentFactory,
  onTagAddRequest: (
    text: Query, event: SyntheticKeyboardEvent<*>
  ) => void,
  onTagDeleteRequest: (
    indices: Array<number>,
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    queryNodeText?: Query
  ) => void,
  onPasteRequest?: ?(event: SyntheticClipboardEvent<*>) => void,
}

