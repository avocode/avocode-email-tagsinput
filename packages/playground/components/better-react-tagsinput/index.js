// @flow

import React from 'react'
import { HashRouter as Router, Route, Link } from 'react-router-dom'

import Basic from './basic'
import Controlled from './controlled'
import BasicWithTagState from './basic-with-tag-state'
import Paste from './paste'
import Collapsible from './collapsible'
import Styling from './styling'
import CustomTag from './custom-tag'
import Performance from './performance'
import TestE2E from './test-e2e'
import TestE2ECollapsible from './test-e2e-collapsible-tagsinput'

type Props = {
  match: {
    url: string,
  },
}

export default class BetterReactTagsInputView extends React.PureComponent<Props> {
  render() {
    const { match } = this.props
    const url = match.url === '/' ? '/better-react-tagsinput' : match.url

    return (
      <Router>
        <div>
          <nav>
            <ul className='subnav'>
              <li className='subnav-item'><Link to={`${url}/basic`}>Basic</Link></li>
              <li className='subnav-item'><Link to={`${url}/controlled`}>Controlled</Link></li>
              <li className='subnav-item'><Link to={`${url}/basic-with-state`}>State</Link></li>
              <li className='subnav-item'><Link to={`${url}/paste`}>Paste</Link></li>
              <li className='subnav-item'><Link to={`${url}/collapsible`}>Collapsible</Link></li>
              <li className='subnav-item'><Link to={`${url}/styling`}>Styling</Link></li>
              <li className='subnav-item'><Link to={`${url}/custom-tag`}>Custom tag</Link></li>
              <li className='subnav-item'><Link to={`${url}/performance`}>Performance</Link></li>
            </ul>
          </nav>

          <Route path={`${match.url}/`} exact component={Basic} />
          <Route path={`${url}/basic`} component={Basic} />
          <Route path={`${url}/controlled`} component={Controlled} />
          <Route path={`${url}/basic-with-state`} component={BasicWithTagState} />
          <Route path={`${url}/paste`} component={Paste} />
          <Route path={`${url}/collapsible`} component={Collapsible} />
          <Route path={`${url}/styling`} component={Styling} />
          <Route path={`${url}/custom-tag`} component={CustomTag} />
          <Route path={`${url}/performance`} component={Performance} />
          <Route path={`${url}/test-tagsinput`} component={TestE2E} />
          <Route path={`${url}/test-collapsible-tagsinput`} component={TestE2ECollapsible} />
        </div>
      </Router>
    )
  }
}
