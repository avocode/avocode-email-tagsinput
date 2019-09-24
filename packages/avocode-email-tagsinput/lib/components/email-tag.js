// @flow

import React from 'react'

import { TagComponent } from '@avocode/better-react-tagsinput'
import type { TagComponentProps } from '@avocode/better-react-tagsinput/dist/types'

export default class EmailTag extends React.PureComponent<TagComponentProps> {
  static displayName = 'EmailTag'

  render() {
    return (
      <TagComponent
        {...this.props}
        title={this.props.contents}
        defaultName='avocode-email-tagsinput-tag'
      />
    )
  }
}
