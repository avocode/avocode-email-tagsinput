// @flow

import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Basic from './basic'
import WithoutCollapsible from './without-collapsible'
import Controlled from './controlled'
import Errored from './errored'

type Props = {
  match: {
    url: string,
  },
}

export default class StyledAvocodeEmailTagsInputView extends React.PureComponent<Props> {
  render() {
    const { match } = this.props
    const url = match.url === '/' ? '/styled-avocode-email-tagsinput' : match.url

    return (
      <Router>
        <div>
          <nav>
            <ul className='subnav'>
              <li className='subnav-item'><Link to={`${url}/basic`}>Basic</Link></li>
              <li className='subnav-item'><Link to={`${url}/without-collapsible`}>Without Collapsible</Link></li>
              <li className='subnav-item'><Link to={`${url}/controlled`}>Controlled</Link></li>
              <li className='subnav-item'><Link to={`${url}/error`}>Errored</Link></li>
            </ul>
          </nav>

          <Route path={`${match.url}/`} exact component={Basic} />
          <Route path={`${url}/basic`} component={Basic} />
          <Route path={`${url}/without-collapsible`} component={WithoutCollapsible} />
          <Route path={`${url}/controlled`} component={Controlled} />
          <Route path={`${url}/error`} component={Errored} />
        </div>
      </Router>
    )
  }
}
