// @flow

import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import marked from 'marked'

import AvocodeEmailTagsInputView from './avocode-email-tagsiput/'
import BetterReactTagsInputView from './better-react-tagsinput/'
import ApiView from './api-view'

import '../styles/index.css'

type State = {
  apiDocs: {
    'avocode-email-tagsinput': ?string,
    'better-react-tagsinput': ?string,
  },
}

export default class App extends React.Component<{}, State> {
  state = {
    apiDocs: {},
  }

  componentDidMount() {
    this._fetchApiDocs()
  }

  _fetchApiDocs = () => {
    const docs = [ 'avocode-email-tagsinput', 'better-react-tagsinput' ]

    docs.forEach((docName) => {
      fetch(`static/${docName}.md`)
        .then((response) => response.text())
        .then((text) => {
          this.setState((prevState) => {
            return {
              apiDocs: {
                ...prevState.apiDocs,
                [docName]: marked(text),
              },
            }
          })
        })
    })
  }

  render() {
    const avocodeEmailTagsInputDoc = this.state.apiDocs['avocode-email-tagsinput']
    const betterReactTagsInputDoc = this.state.apiDocs['better-react-tagsinput']

    return (
      <Router>
        <div className='app-container'>
          <div className='app-container__header'>
            <nav>
              <ul className='nav'>
                <li className='nav-item'><Link to="/avocode-email-tagsinput">Avocode Email TagsInput</Link></li>
                <li className='nav-item'><Link to="/better-react-tagsinput">Better React TagsInput</Link></li>
              </ul>
            </nav>

            <Route path='/' exact component={AvocodeEmailTagsInputView} />
            <Route path='/avocode-email-tagsinput' component={AvocodeEmailTagsInputView} />
            <Route path='/better-react-tagsinput' component={BetterReactTagsInputView} />
          </div>
          <div className='app-container__api'>
            <Route
              exact
              path='/'
              render={() => (
                <ApiView
                  doc={avocodeEmailTagsInputDoc}
                  retryApiDocsLoadRequest={this._fetchApiDocs}
                />
              )}
            />
            <Route
              path='/avocode-email-tagsinput'
              render={() => (
                <ApiView
                  doc={avocodeEmailTagsInputDoc}
                  retryApiDocsLoadRequest={this._fetchApiDocs}
                />
              )}
            />
            <Route
              path='/better-react-tagsinput'
              render={() => (
                <ApiView
                  doc={betterReactTagsInputDoc}
                  retryApiDocsLoadRequest={this._fetchApiDocs}
                />
              )}
            />
          </div>
        </div>
      </Router>
    )
  }
}

