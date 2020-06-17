// @flow

import React from 'react'
import AvocodeEmailTagsinput, { utils } from '@avocode/avocode-email-tagsinput'
import classNames from 'classnames'

import type { Name, Query, Tags } from '@avocode/avocode-email-tagsinput/dist/types'

// $FlowFixMe: Ignore styles
import '../styles/index.css'

type Props = {
  theme: 'dark' | 'light' | string,
  error?: any,
  tags: Tags,
  query: Query,
  name?: Name,
  unique: boolean,
  collapsible: boolean,
  renderCounter?: (attributes: { focused: boolean, tagCount: number }) => React$Node,
  submitKeyCodes?: Array<number>,
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


export default class StyledAvocodeEmailTagsinput extends React.PureComponent<Props> {
  static defaultProps = {
    theme: 'light',
    collapsible: true,
    unique: true,
  }

  _getNormalizedTheme(theme: string): 'light' | 'dark' {
    return (theme === 'light' || theme === 'dark') ? theme : 'light'
  }

  render() {
    const { error } = this.props
    const theme = this._getNormalizedTheme(this.props.theme)
    const name = classNames({
      'styled-avocode-email-tagsinput--error': Boolean(error),
      'styled-avocode-email-tagsinput--light': (theme === 'light' && !error),
      'styled-avocode-email-tagsinput--light--error': (theme === 'light' && error),
      'styled-avocode-email-tagsinput--dark': (theme === 'dark' && !error),
      'styled-avocode-email-tagsinput--dark--error': (theme === 'dark' && error),
    })

    return (
      <AvocodeEmailTagsinput {...this.props} name={name} />
    )
  }
}

export { utils }
