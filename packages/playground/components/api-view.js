// @flow

import React from 'react'

type Props = {
  doc: ?string,
  retryApiDocsLoadRequest?: () => void,
}

type State = {
  failedToLoad: boolean,
}

export default class ApiView extends React.PureComponent<Props, State> {
  state = { failedToLoad: false }

  componentDidMount() {
    this._loadDoc = setTimeout(() => {
      this.setState({
        failedToLoad: !this.props.doc,
      })
    }, 10000)
  }

  componentWillUnmount() {
    if (Number.isFinite(this._loadDoc)) {
      clearTimeout(this._loadDoc)
    }
  }

  _loadDoc: ?TimeoutID = null

  _handleRetryClick = (event: SyntheticMouseEvent<*>) => {
    event.preventDefault()

    if (this.props.retryApiDocsLoadRequest) {
      this.props.retryApiDocsLoadRequest()
    }
  }

  render() {
    return (
      <div className='api-view'>
        {!this.props.doc && !this.state.failedToLoad &&
          <div className='api-view__loading'>
            Loading API docs...
          </div>
        }
        {this.state.failedToLoad &&
          <div className='api-view__loading-failed'>
            Failed to load API docs. <button onClick={this._handleRetryClick}>Retry</button>
          </div>
        }
        <section>
          {this.props.doc &&
            /* eslint-disable-next-line react/no-danger */
            <article dangerouslySetInnerHTML={{ __html: this.props.doc }} />
          }
        </section>
      </div>
    )
  }
}
