// @flow

import React from 'react'

import type { Tags, Query } from '@avocode/better-react-tagsinput/dist/types'

type Props = {
  tags: Tags,
  query: Query,
}

export default class StateView extends React.PureComponent<Props> {
  render() {
    const { tags, query, ...rest } = this.props
    return (
      <div className='state-view'>
        <strong>Props</strong>
        <dl>
          <dt>tags</dt>
          <dd>{this.props.tags.map((t) => JSON.stringify(t)).join(' , ')}</dd>
          <dt>query</dt>
          <dd>{this.props.query}</dd>
          {Object.keys(rest).map((prop) => (
            <React.Fragment>
              <dt>{prop}</dt>
              <dd>{JSON.stringify(rest[prop])}</dd>
            </React.Fragment>
          ))}
        </dl>
      </div>
    )
  }
}

