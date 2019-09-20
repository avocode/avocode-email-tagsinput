// @flow

import React from 'react'
import classNames from 'classnames'
import { TAG_PLUGIN_NODE_ID } from '../plugins/tags'

import type { TagComponentProps } from '../types'

export default class TagComponent extends React.PureComponent<TagComponentProps> {
  static defaultProps = {
    defaultName: '',
    name: '',
    state: '',
  }

  _handleOnRemoveButtonClick = (event: SyntheticMouseEvent<*>) => {
    this.props.onRemoveButtonClick(event, this.props.id)
  }

  _handleOnMouseDown = (event: SyntheticMouseEvent<*>) => {
    // NOTE: We need to prevent blur event from hapenning when this component
    //       is rendered in CollapsibleTagsInput
    event.preventDefault()
  }

  render() {
    const stateName = this.props.name
      ? `${this.props.name}--${this.props.state}`
      : this.props.state

    return (
      <span
        title={this.props.title || ''}
        contentEditable={false}
        className={classNames(TAG_PLUGIN_NODE_ID, {
          [`${TAG_PLUGIN_NODE_ID}--${this.props.name}`]: this.props.name,
          [`${TAG_PLUGIN_NODE_ID}--${this.props.defaultName}`]: this.props.defaultName,
          [`${TAG_PLUGIN_NODE_ID}--focused`]: this.props.isFocused,
          [`${TAG_PLUGIN_NODE_ID}--${this.props.name}--focused`]: this.props.isFocused && this.props.name,
          [`${TAG_PLUGIN_NODE_ID}--${this.props.defaultName}--focused`]: this.props.isFocused && this.props.defaultName,
          [`${TAG_PLUGIN_NODE_ID}--${stateName}`]: this.props.state,
          [`${TAG_PLUGIN_NODE_ID}--${stateName}--focused`]: this.props.isFocused && this.props.state,
        })}
      >
        <span
          className={classNames(`${TAG_PLUGIN_NODE_ID}__label`, {
            [`${TAG_PLUGIN_NODE_ID}__label--${this.props.name}`]: this.props.name,
            [`${TAG_PLUGIN_NODE_ID}__label--${this.props.defaultName}`]: this.props.defaultName,
            [`${TAG_PLUGIN_NODE_ID}__label--${stateName}`]: this.props.state,
          })}
        >
          {this.props.contents}
          {this.props.children}
        </span>
        <button
          className={classNames(`${TAG_PLUGIN_NODE_ID}__remove-button`, {
            [`${TAG_PLUGIN_NODE_ID}__remove-button--${this.props.name}`]: this.props.name,
            [`${TAG_PLUGIN_NODE_ID}__remove-button--${this.props.defaultName}`]: this.props.defaultName,
            [`${TAG_PLUGIN_NODE_ID}__remove-button--${stateName}`]: this.props.state,
          })}
          onClick={this._handleOnRemoveButtonClick}
          onMouseDown={this._handleOnMouseDown}
        />
      </span>
    )
  }
}
