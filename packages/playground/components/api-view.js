import React from 'react'

export default class ApiView extends React.PureComponent {
  state = { failedToLoad: false }
  _loadDoc = null

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

  _handleRetryClick = (event) => {
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
            Failed to load API docs. <a href="#" onClick={this._handleRetryClick}>Retry</a>
          </div>
        }
        <section>
        {this.props.doc &&
          <article dangerouslySetInnerHTML={{__html: this.props.doc}} />
        }
        </section>
      </div>
    )
  }
}
