// @flow

import React from 'react'
import AvocodeEmailTagsInput from '@avocode/avocode-email-tagsinput'

export default class Basic extends React.PureComponent<{}> {
  render() {
    return (
      <div>
        <p>
          <code>AvocodeTagsInput</code> is input for inserting tags that are valid emails. By default it 
          should <i>"just work"</i>.
          Try typing valid email and hitting <i>Comma</i>, <i>Enter</i> or <i>Space</i> to add new tag.
        </p>

        <AvocodeEmailTagsInput />
      </div>
    )
  }
}

