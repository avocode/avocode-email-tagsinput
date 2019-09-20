// @flow
import React from 'react'

import { TagComponent } from '@avocode/better-react-tagsinput'

export default class EmailTag extends React.PureComponent<{}> {
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
