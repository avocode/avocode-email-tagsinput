// @flow

import React from 'react'
import classNames from 'classnames'
import { TAG_PLUGIN_NODE_ID } from '../plugins/tags'

import type { Name, Query, Tag } from '../index.js.flow'

type Props = {
  id: string,
  state: string,
  name: Name,
  contents: Query,
  children?: React$Node,
  isFocused: boolean,
  onRemoveButtonClick: (event: SyntheticMouseEvent<*>, id: string) => void,
}

export default class TagComponent extends React.PureComponent<Props> {
  static defaultProps = {
    name: '',
    state: '',
  }

  _handleOnRemoveButtonClick = (event: SyntheticMouseEvent<*>) => {
    this.props.onRemoveButtonClick(event, this.props.id)
  }

  render() {
    const stateName = this.props.name
      ? `${this.props.name}--${this.props.state}`
      : this.props.state

    return (
      <span
        tabIndex={1}
        contentEditable={false}
        className={classNames(TAG_PLUGIN_NODE_ID, {
          [`${TAG_PLUGIN_NODE_ID}--${this.props.name}`]: this.props.name,
          [`${TAG_PLUGIN_NODE_ID}--focused`]: this.props.isFocused,
          [`${TAG_PLUGIN_NODE_ID}--${this.props.name}--focused`]: this.props.isFocused && this.props.name,
          [`${TAG_PLUGIN_NODE_ID}--${stateName}`]: this.props.state,
          [`${TAG_PLUGIN_NODE_ID}--${stateName}--focused`]: this.props.isFocused && this.props.state,
        })}
      >
        <span
          className={classNames(`${TAG_PLUGIN_NODE_ID}__label`, {
            [`${TAG_PLUGIN_NODE_ID}__label--${this.props.name}`]: this.props.name,
            [`${TAG_PLUGIN_NODE_ID}__label--${stateName}`]: this.props.state,
          })}
        >
          {this.props.contents}
          {this.props.children}
        </span>
        <button
          className={classNames(`${TAG_PLUGIN_NODE_ID}__remove-button`, {
            [`${TAG_PLUGIN_NODE_ID}__remove-button--${this.props.name}`]: this.props.name,
            [`${TAG_PLUGIN_NODE_ID}__remove-button--${stateName}`]: this.props.state,
          })}
          onClick={this._handleOnRemoveButtonClick}
        />
      </span>
    )
  }
}
