// @flow
import React from 'react'
import classNames from 'classnames'

import { TagComponent } from '@avocode/better-react-tagsinput'

export default class EmailTag extends React.PureComponent<{}> {
  render() {
    return (
      <TagComponent
        {...this.props}
        title={this.props.contents}
        name={classNames('avocode-email-tagsinput-tag', {
          [`avocode-email-tagsinput-tag--${this.props.name}`]: Boolean(this.props.name),
        })}
      />
    )
  }
}
