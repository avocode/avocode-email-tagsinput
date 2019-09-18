// @flow

import React from 'react'
import classNames from 'classnames'

type Props = {
  name: string,
  count: number,
  onClick?: () => void,
}

export default class Counter extends React.PureComponent<Props> {
  static defaultProps = {
    name: '',
    count: 0,
  }

  render() {
    const { count } = this.props
    const countString = count < 99 ? `+${count}` : '+99'

    return (
      <div className={classNames('avocode-email-tagsinput-counter', {
          [`avocode-email-tagsinput-counter--${this.props.name}`]: this.props.name,
        })}
        onClick={this.props.onClick}
      >
        {countString}
      </div>
    )
  }
}
