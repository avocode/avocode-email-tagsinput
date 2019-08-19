import React from 'react'

export default class ApiView extends React.PureComponent {
  state = { failedToLoad: false }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        failedToLoad: !this.props.doc,
      })
    }, 10000)
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
