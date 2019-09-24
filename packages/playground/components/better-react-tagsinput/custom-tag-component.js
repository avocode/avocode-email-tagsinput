import React from 'react'
import classNames from 'classnames'

import type { TagComponentProps } from '@avocode/better-react-tagsinput/dist/types'

export default class CustomTagComponent extends React.PureComponent<TagComponentProps> {
  _handleOnRemoveButtonClick = (event: SyntheticMouseEvent<*>) => {
    this.props.onRemoveButtonClick(event, this.props.id)
  }

  _handleOnMouseDown = (event: SyntheticMouseEvent<*>) => {
    // NOTE: We need to prevent blur event from hapenning when this component
    //       is rendered in CollapsibleTagsInput
    event.preventDefault()
  }

  render() {
    const {
      isFocused,
      name,
      contents,
      state,
      onRemoveButtonClick,
      ...attributes
    } = this.props

    return (
      <span
        {...attributes}
        className={classNames('my-custom-tag', {
          'my-custom-tag--focused': isFocused,
          [`my-custom-tag--${state}`]: Boolean(state),
        })}
        onClick={this._handleOnRemoveButtonClick}
        onMouseDown={this._handleOnMouseDown}
      >
        {this.props.contents}
        {this.props.children}
      </span>
    )
  }
}

