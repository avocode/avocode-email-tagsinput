// @flow

import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import { utils } from '@avocode/better-react-tagsinput'

import Basic from './basic'
import Controlled from './controlled'
import Unique from './unique'
import Collapsible from './collapsible'

type Props = {
  match: {
    url: string,
  }
}

export default class AvocodeEmailTagsInputView extends React.PureComponent<Props> {
  render() {
    const { match } = this.props
    const url = match.url === '/' ? '/avocode-email-tagsinput' : match.url

    return (
      <Router>
        <div>
          <nav>
            <ul className='subnav'>
              <li className='subnav-item'><Link to={`${url}/basic`}>Basic</Link></li>
              <li className='subnav-item'><Link to={`${url}/controlled`}>Controlled</Link></li>
              <li className='subnav-item'><Link to={`${url}/unique`}>Unique</Link></li>
              <li className='subnav-item'><Link to={`${url}/collapsible`}>Collapsible</Link></li>
            </ul>
          </nav>

          <Route path={`${match.url}/`} exact component={Basic} />
          <Route path={`${url}/basic`} component={Basic} />
          <Route path={`${url}/controlled`} component={Controlled} />
          <Route path={`${url}/unique`} component={Unique} />
          <Route path={`${url}/collapsible`} component={Collapsible} />
        </div>
      </Router>
    )
  }
}
