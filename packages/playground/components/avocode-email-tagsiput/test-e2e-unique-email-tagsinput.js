// @flow

import React from 'react'
import AvocodeEmailTagsInput from '@avocode/avocode-email-tagsinput'

export default class TestE2EUniqueEmailTags extends React.PureComponent<{}> {
  render() {
    return (
      <div>
        <AvocodeEmailTagsInput
          unique
        />
      </div>
    )
  }
}
