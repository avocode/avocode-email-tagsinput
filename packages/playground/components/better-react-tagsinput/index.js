import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Basic from './basic'
import Controlled from './controlled'
import BasicWithTagState from './basic-with-tag-state'
import Paste from './paste'
import Collapsible from './collapsible'
import Styling from './styling'

export default class BetterReactTagsInputView extends React.PureComponent {
  render() {
    const { match } = this.props

    return (
      <Router>
        <div>
          <nav>
            <ul className='subnav'>
              <li className='subnav-item'><Link to={`${match.url}/basic`}>Basic</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/controlled`}>Controlled</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/basic-with-state`}>State</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/paste`}>Paste</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/collapsible`}>Collapsible</Link></li>
              <li className='subnav-item'><Link to={`${match.url}/styling`}>Styling</Link></li>
            </ul>
          </nav>

          <Route path={`${match.url}/`} exact component={Basic} />
          <Route path={`${match.url}/basic`} component={Basic} />
          <Route path={`${match.url}/controlled`} component={Controlled} />
          <Route path={`${match.url}/basic-with-state`} component={BasicWithTagState} />
          <Route path={`${match.url}/paste`} component={Paste} />
          <Route path={`${match.url}/collapsible`} component={Collapsible} />
          <Route path={`${match.url}/styling`} component={Styling} />
        </div>
      </Router>
    )
  }
}
