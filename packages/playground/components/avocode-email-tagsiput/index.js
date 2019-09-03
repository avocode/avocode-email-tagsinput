import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'
import { utils } from '@avocode/better-react-tagsinput'

import Basic from './basic'
import Controlled from './controlled'
import Unique from './unique'
import Collapsible from './collapsible'

export default class AvocodeEmailTagsInputView extends React.PureComponent {
  render() {
    const { match } = this.props

    return (
      <Router>
        <div>
          <nav>
            <ul className='subnav'>
              <li className='subnav-item'><Link to={`${match.url}/basic`}>Basic</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/controlled`}>Controlled</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/unique`}>Unique</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/collapsible`}>Collapsible</Link></li>
            </ul>
          </nav>

          <Route path={`${match.url}/`} exact component={Basic} />
          <Route path={`${match.url}/basic`} component={Basic} />
          <Route path={`${match.url}/controlled`} component={Controlled} />
          <Route path={`${match.url}/unique`} component={Unique} />
          <Route path={`${match.url}/collapsible`} component={Collapsible} />
        </div>
      </Router>
    )
  }
}
